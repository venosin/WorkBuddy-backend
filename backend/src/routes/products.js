import express from "express";
const router = express.Router();
import productsController from "../controllers/productsController.js";

router.route("/")
  .get(productsController.getProducts)
  .post(productsController.createProduct);

router.route("/:id")
  .get(productsController.getProduct)
  .put(productsController.updateProduct)
  .delete(productsController.deleteProduct);

export default router;
