/*
Rutas para gestionar el perfil de usuario
*/

import express from "express";
import profileController from "../controllers/profileController.js";
import upload from "../middlewares/uploadMiddleware.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Todas las rutas del perfil requieren autenticación
router.use(verifyToken);

// Rutas para información del perfil
router.route("/")
  .get(profileController.getUserProfile)
  .put(upload.single("profileImage"), profileController.updateUserProfile);

export default router;
