import express from "express";
import offersController from "../controllers/offersController.js";

const router = express.Router();

router.route("/")
  .get(offersController.getOffers)    // Obtener todas las ofertas
  .post(offersController.createOffer); // Crear una nueva oferta

router.route("/:id")
  .get(offersController.get1Offer)     // Obtener una oferta por su ID
  .put(offersController.updateOffer)   // Actualizar una oferta por su ID
  .delete(offersController.deleteOffer); // Eliminar una oferta por su ID

export default router;
