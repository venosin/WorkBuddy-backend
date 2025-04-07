/*
Rutas para gestionar los pedidos del usuario
*/

import express from "express";
import userOrdersController from "../controllers/userOrdersController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Todas las rutas de pedidos requieren autenticación
router.use(verifyToken);

// Ruta para obtener todos los pedidos del usuario actual
router.get("/", userOrdersController.getUserOrders);

// Ruta para obtener estadísticas de pedidos
router.get("/stats", userOrdersController.getOrdersCountByStatus);

// Ruta para obtener detalles de un pedido específico
router.get("/:orderId", userOrdersController.getOrderDetails);

export default router;
