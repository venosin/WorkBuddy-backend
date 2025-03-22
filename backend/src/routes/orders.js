import express from "express";

const router = express.Router();
import ordersController from "../controllers/ordersController.js";

router.route("/")
  .get(ordersController.getOrders)
  .post(ordersController.createOrder);

router.route("/:id")
  .get(ordersController.getOrderById)
  .put(ordersController.updateOrderStatus)
  .delete(ordersController.deleteOrder);

export default router;
