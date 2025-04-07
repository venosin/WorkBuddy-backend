/*
Rutas para gestionar la configuración y preferencias del usuario
*/

import express from "express";
import userSettingsController from "../controllers/userSettingsController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Todas las rutas de configuración requieren autenticación
router.use(verifyToken);

// Ruta para obtener toda la configuración
router.get("/", userSettingsController.getSettings);

// Rutas para preferencias
router.route("/preferences")
  .put(userSettingsController.updatePreferences);

// Rutas para direcciones
router.route("/addresses")
  .get(userSettingsController.getAddresses)
  .post(userSettingsController.addAddress);

// Rutas para operaciones en direcciones específicas
router.route("/addresses/:addressId")
  .put(userSettingsController.updateAddress)
  .delete(userSettingsController.deleteAddress);

export default router;
