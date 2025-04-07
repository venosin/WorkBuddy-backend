import express from "express";
const router = express.Router();
import productsController from "../controllers/productsController.js";
import upload from "../middlewares/uploadMiddleware.js";

// Ruta para obtener todos los productos y crear un nuevo producto
router.route("/")
  .get(productsController.getProducts)
  .post(upload.single('image'), productsController.createProduct);

// Ruta para operaciones con productos específicos por ID
router.route("/:id")
  .get(productsController.getProduct)
  .put(upload.single('image'), productsController.updateProduct)
  .delete(productsController.deleteProduct);

export default router;
