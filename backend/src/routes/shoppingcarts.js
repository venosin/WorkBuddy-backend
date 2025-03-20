import express from "express";

const router = express.Router();
import shoppingCartsController from "../controllers/shoppingCartsController.js";


router.get("/", shoppingCartsController.getShoppingCarts);
router.get("/:id", shoppingCartsController.getShoppingCart);
router.post("/", shoppingCartsController.createShoppingCart);
router.put("/:id", shoppingCartsController.updateShoppingCart);
router.delete("/:id", shoppingCartsController.deleteShoppingCart);
router.post("/:id/addProduct", shoppingCartsController.addProduct);
router.post("/:id/removeProduct", shoppingCartsController.removeProduct);

export default router;
