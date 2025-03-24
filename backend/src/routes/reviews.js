import express from "express";
import reviewsController from "../controllers/reviewsController.js";

const router = express.Router();

router.route("/product/:productId") // 👈 Cambia la ruta para evitar confusión
  .get(reviewsController.getProductReviews);

router.route("/")
  .get(reviewsController.getAllReviews) 
  .post(reviewsController.createReview);

router.route("/:id")
  .get(reviewsController.getReviewById)
  .put(reviewsController.updateReview)
  .delete(reviewsController.deleteReview);


export default router;
