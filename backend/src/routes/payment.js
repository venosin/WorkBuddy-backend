/*
Rutas para gestionar pagos
*/

import express from "express";
import paymentController from "../controllers/paymentController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Todas las rutas de pagos requieren autenticación
router.use(verifyToken);

// Ruta para iniciar el proceso de pago de una orden existente
router.post("/init-payment", paymentController.initPaymentProcess);

// Ruta para iniciar el proceso de pago con PayPal
router.post("/create-payment", paymentController.createPayment);

// Ruta para completar el pago después de la aprobación del usuario
router.post("/capture-payment", paymentController.capturePayment);

// Ruta para cancelar un pago
router.post("/cancel-payment", paymentController.cancelPayment);

// Ruta para obtener el estado de un pago
router.get("/status/:orderId", paymentController.getPaymentStatus);

export default router;
