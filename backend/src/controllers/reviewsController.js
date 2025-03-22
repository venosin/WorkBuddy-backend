import Review from "../models/Reviews.js";
import Product from "../models/Products.js";

const reviewsController = {
  // Obtener todas las reseñas de un producto
  getProductReviews: async (req, res) => {
    try {
      const reviews = await Review.find({ product: req.params.productId })
        .populate("user", "name")
        .sort({ createdAt: -1 });
      res.json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener las reseñas");
    }
  },

  // Obtener una reseña por ID
  getReviewById: async (req, res) => {
    try {
      const review = await Review.findById(req.params.id)
        .populate("user", "name")
        .populate("product", "name");

      if (!review) {
        return res.status(404).json({ msg: "Reseña no encontrada" });
      }
      res.json(review);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error del servidor");
    }
  },

  // Crear una nueva reseña
  createReview: async (req, res) => {
    const { productId, rating, comment } = req.body;

    try {
      const existingReview = await Review.findOne({
        user: req.user.id,
        product: productId,
      });

      if (existingReview) {
        return res.status(400).json({ msg: "Ya has hecho una reseña de este producto" });
      }

      const newReview = new Review({
        user: req.user.id,
        product: productId,
        rating,
        comment,
      });

      const review = await newReview.save();
      await reviewsController.updateProductRating(productId);

      const populatedReview = await Review.findById(review._id)
        .populate("user", "name")
        .populate("product", "name");

      res.json(populatedReview);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al crear la reseña");
    }
  },

  // Actualizar una reseña
  updateReview: async (req, res) => {
    const { rating, comment } = req.body;

    try {
      let review = await Review.findById(req.params.id);

      if (!review) {
        return res.status(404).json({ msg: "Reseña no encontrada" });
      }

      if (review.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "No autorizado" });
      }

      review = await Review.findByIdAndUpdate(
        req.params.id,
        { $set: { rating, comment, updatedAt: Date.now() } },
        { new: true }
      )
        .populate("user", "name")
        .populate("product", "name");

      await reviewsController.updateProductRating(review.product);
      res.json(review);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error del servidor");
    }
  },

  // Eliminar una reseña
  deleteReview: async (req, res) => {
    try {
      const review = await Review.findById(req.params.id);
      if (!review) {
        return res.status(404).json({ msg: "Reseña no encontrada" });
      }

      if (review.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "No autorizado" });
      }

      const productId = review.product;
      await Review.findByIdAndRemove(req.params.id);
      await reviewsController.updateProductRating(productId);

      res.json({ msg: "Reseña eliminada" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error del servidor");
    }
  },

  // Obtener las reseñas de un usuario
  getUserReviews: async (req, res) => {
    try {
      const reviews = await Review.find({ user: req.user.id })
        .populate("product", "name")
        .sort({ createdAt: -1 });
      res.json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener las reseñas del usuario");
    }
  },

  // Actualizar la calificación promedio del producto
  updateProductRating: async (productId) => {
    try {
      const reviews = await Review.find({ product: productId });
      if (reviews.length === 0) {
        await Product.findByIdAndUpdate(productId, { averageRating: 0, numberOfReviews: 0 });
        return;
      }

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      await Product.findByIdAndUpdate(productId, { averageRating, numberOfReviews: reviews.length });
    } catch (error) {
      console.error("Error al actualizar la calificación del producto:", error);
    }
  },
};

export default reviewsController;
