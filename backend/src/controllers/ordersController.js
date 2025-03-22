// Aquí en el controlador irán todos los métodos (CRUD)

import Order from "../models/Orders.js";
const ordersController = {};

// OBTENER TODAS LAS ÓRDENES
ordersController.getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.product", "name price");
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener las órdenes" });
    }
};

// OBTENER UNA ORDEN POR ID
ordersController.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "name email")
            .populate("items.product", "name price");

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
        const { items, shippingAddress, paymentMethod } = req.body;

        const newOrder = new Order({
            user: req.user.id, // Usuario autenticado
            items,
            shippingAddress,
            paymentMethod,
            status: "pending",
            totalAmount: items.reduce((total, item) => total + (item.price * item.quantity), 0),
        });

        const order = await newOrder.save();

        // Retornar orden con datos poblados
        const populatedOrder = await Order.findById(order._id)
            .populate("user", "name email")
            .populate("items.product", "name price");

        res.json({ message: "Orden creada con éxito", order: populatedOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear la orden" });
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
        ).populate("user", "name email")
         .populate("items.product", "name price");

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
        const orders = await Order.find({ user: req.user.id })
            .populate("items.product", "name price")
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener las órdenes del usuario" });
    }
};

export default ordersController;
