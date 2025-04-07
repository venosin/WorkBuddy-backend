/*
Rutas para gestionar los productos favoritos del usuario
*/

import express from "express";
import favoritesController from "../controllers/favoritesController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Todas las rutas de favoritos requieren autenticación
router.use(verifyToken);

// Ruta para obtener todos los favoritos del usuario
router.get("/", favoritesController.getFavorites);

// Rutas para agregar/eliminar productos de favoritos
router.route("/:productId")
  .post(favoritesController.addToFavorites)
  .delete(favoritesController.removeFromFavorites);

export default router;
