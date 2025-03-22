import express from "express";
import reviewsController from "../controllers/reviewsController.js";

const router = express.Router();

router.route("/:productId") // ← Quitamos "reviews"
  .get(reviewsController.getProductReviews);

router.route("/")
  .get(reviewsController.getAllReviews) // Nueva ruta para obtener todas las reseñas
  .post(reviewsController.createReview);

router.route("/:id")
  .get(reviewsController.getReviewById)
  .put(reviewsController.updateReview)
  .delete(reviewsController.deleteReview);

export default router;
