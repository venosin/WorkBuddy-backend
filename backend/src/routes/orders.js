import express from "express";

const router = express.Router();
import ordersController from "../controllers/ordersController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

router.route("/")
  .get(ordersController.getOrders)
  .post(ordersController.createOrder);

// Ruta para obtener las órdenes del usuario actual (requiere autenticación)
router.get("/user", verifyToken, ordersController.getUserOrders);

router.route("/:id")
  .get(ordersController.getOrderById)
  .put(ordersController.updateOrderStatus)
  .delete(ordersController.deleteOrder)
export default router;
