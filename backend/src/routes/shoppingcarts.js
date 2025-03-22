import express from "express";

const router = express.Router();
import shoppingCartsController from "../controllers/shoppingCartsController.js";

router.route("/")
  .get(shoppingCartsController.getShoppingCarts)
  .post(shoppingCartsController.createShoppingCart);

router.route("/:id")
  .get(shoppingCartsController.getShoppingCart)
  .put(shoppingCartsController.updateShoppingCart)
  .delete(shoppingCartsController.deleteShoppingCart);

router.post("/:id/addProduct", shoppingCartsController.addProduct);
router.post("/:id/removeProduct", shoppingCartsController.removeProduct);

export default router;
