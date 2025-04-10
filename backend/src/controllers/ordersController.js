// Aquí en el controlador irán todos los métodos (CRUD)

import Order from "../models/Orders.js";
import shoppingCartsModel from "../models/ShoppingCarts.js";
import mongoose from "mongoose";
const ordersController = {};

// OBTENER TODAS LAS ÓRDENES
ordersController.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("CartId");
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener las órdenes" });
    }
};

// OBTENER UNA ORDEN POR ID
ordersController.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("CartId");

        if (!order) {
            return res.status(404).json({ message: "Orden no encontrada" });
        }

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener la orden" });
    }
};

// CREAR UNA NUEVA ORDEN
ordersController.createOrder = async (req, res) => {
    try {
        console.log("Body recibido:", req.body); // Depuración

        const { CartId, payMethod, shippingAdress } = req.body;
        const { userId, userType } = req.user; // Obtener del token de autenticación

        // Validar que los datos existen
        if (!CartId || !payMethod || !shippingAdress) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        // Validar que CartId es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(CartId)) {
            return res.status(400).json({ message: "CartId no es válido" });
        }

        // Calcular el total del carrito
        const cart = await shoppingCartsModel.findById(CartId).populate('products.idProduct');
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        // Calcular el total
        let totalAmount = 0;
        for (const item of cart.products) {
            if (item.idProduct && item.idProduct.price) {
                totalAmount += item.idProduct.price * item.quantity;
            }
        }
        totalAmount = parseFloat(totalAmount.toFixed(2)); // Redondear a 2 decimales

        // Parsear la dirección de envío en componentes
        // Asumimos que shippingAdress está en formato "calle, ciudad, estado, código postal"
        const addressParts = shippingAdress.split(',').map(part => part.trim());
        
        // Crear la nueva orden con los campos requeridos
        const newOrder = new Order({ 
            CartId,
            userId, // Referencia directa al usuario
            userType, // Tipo de usuario (cliente o empleado)
            paymentInfo: {
                method: payMethod,
                status: "pending"
            },
            shippingAddress: {
                street: addressParts[0] || shippingAdress,
                city: addressParts[1] || "Ciudad",
                state: addressParts[2] || "Estado",
                postalCode: addressParts[3] || "00000"
            },
            status: "pending",
            totalAmount: totalAmount
        });

        const order = await newOrder.save();

        res.status(201).json({ message: "Orden creada con éxito", order });
    } catch (error) {
        console.error("Error al crear la orden:", error);
        res.status(500).json({ message: "Error al crear la orden", error: error.message });
    }
};


// ACTUALIZAR ESTADO DE ORDEN
ordersController.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: { status, updatedAt: Date.now() } },
            { new: true }
        ).populate("CartId");

        if (!order) {
            return res.status(404).json({ message: "Orden no encontrada" });
        }

        res.json({ message: "Estado de la orden actualizado", order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar la orden" });
    }
};

// ELIMINAR UNA ORDEN
ordersController.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Orden no encontrada" });
        }

        if (order.status !== "pending") {
            return res.status(400).json({ message: "Solo se pueden eliminar órdenes pendientes" });
        }

        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: "Orden eliminada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar la orden" });
    }
};

// OBTENER ÓRDENES DE UN USUARIO
ordersController.getUserOrders = async (req, res) => {
    try {
        const { userId } = req.user;
        
        // Obtener parámetros de filtro de la consulta
        const { status, startDate, endDate, limit = 10, page = 1 } = req.query;
        
        // Construir el filtro base
        let filter = {};
        
        // Verificar si el modelo ya tiene el campo userId
        const hasUserIdField = Object.keys(Order.schema.paths).includes('userId');
        
        if (hasUserIdField) {
            // Usar directamente el ID de usuario si existe el campo
            filter.userId = userId;
        } else {
            // Enfoque anterior: buscar a través de carritos
            // Primero obtenemos los carritos del usuario
            const userCarts = await shoppingCartsModel.find({ clienteId: userId });
            
            if (!userCarts || userCarts.length === 0) {
                return res.json({ orders: [], total: 0, page: parseInt(page), pages: 0 });
            }
            
            // Obtener los IDs de los carritos
            const cartIds = userCarts.map(cart => cart._id);
            
            // Añadir filtro de carritos
            filter.CartId = { $in: cartIds };
        }
        
        // Aplicar filtro por estado si se proporciona
        if (status) {
            filter.status = status;
        }
        
        // Aplicar filtro por fecha si se proporciona
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }
        
        // Calcular skip para paginación
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Contar total de registros para paginación
        const total = await Order.countDocuments(filter);
        const pages = Math.ceil(total / parseInt(limit));
        
        // Buscar órdenes con filtros y paginación
        const orders = await Order.find(filter)
            .populate({
                path: "CartId",
                populate: {
                    path: "products.idProduct",
                    select: "name price imageUrl description" // Selecciona campos relevantes
                }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            orders,
            total,
            page: parseInt(page),
            pages
        });
    } catch (error) {
        console.error("Error al obtener las órdenes del usuario:", error);
        res.status(500).json({ message: "Error al obtener las órdenes del usuario", error: error.message });
    }
};

export default ordersController;
