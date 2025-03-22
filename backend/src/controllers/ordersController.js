// Aquí en el controlador irán todos los métodos (CRUD)

import Order from "../models/Orders.js";
import mongoose from "mongoose";
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
        console.log("Body recibido:", req.body); // Depuración

        const { CartId, payMethod, shippingAdress } = req.body;

        // Validar que los datos existen
        if (!CartId || !payMethod || !shippingAdress) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        // Validar que CartId es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(CartId)) {
            return res.status(400).json({ message: "CartId no es válido" });
        }

        const newOrder = new Order({ CartId, payMethod, shippingAdress });

        const order = await newOrder.save();

        res.status(201).json({ message: "Orden creada con éxito", order });
    } catch (error) {
        console.error("Error al crear la orden:", error);
        res.status(500).json({ message: "Error al crear la orden", error });
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
