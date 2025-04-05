import express from "express";
import passwordRecoveryController from "../controllers/passwordRecoveryController.js";

const router = express.Router();

// Ruta para solicitar código de verificación
router.post("/request-code", passwordRecoveryController.requestCode);

// Ruta para verificar el código
router.post("/verify-code", passwordRecoveryController.verifyCode);

// Ruta para restablecer la contraseña
router.post("/reset-password", passwordRecoveryController.resetPassword);

export default router;