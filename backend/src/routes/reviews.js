import express from "express";
import reviewsController from "../controllers/reviewsController.js";

const router = express.Router();

router.route("/:productId/reviews")
  .get(reviewsController.getProductReviews);

router.route("/")
  .post(reviewsController.createReview);

router.route("/:id")
  .get(reviewsController.getReviewById)
  .put(reviewsController.updateReview)
  .delete(reviewsController.deleteReview);

export default router;