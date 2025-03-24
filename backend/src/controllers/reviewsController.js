import Review from "../models/Reviews.js";
import Product from "../models/Products.js";
import mongoose from "mongoose";

// Función para actualizar el rating promedio del producto
const updateProductRating = async (productId) => {
  try {
    const reviews = await Review.find({ productId });
    const totalScore = reviews.reduce((sum, review) => sum + review.score, 0);
    const averageRating = reviews.length ? totalScore / reviews.length : 0;

    await Product.findByIdAndUpdate(productId, {
      averageRating,
      numberOfReviews: reviews.length
    });
  } catch (error) {
    console.error("Error al actualizar la calificación del producto:", error);
  }
};

const reviewsController = {
  // Obtener todas las reseñas
  getAllReviews: async (req, res) => {
    try {
      const reviews = await Review.find()
        .populate("clientId", "name")
        .populate("productId", "name")
        .sort({ createdAt: -1 });
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ msg: "Error al obtener las reseñas" });
    }
  },

  // Obtener reseñas de un producto
  getProductReviews: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
        return res.status(400).json({ msg: "ID de producto inválido" });
      }

      const reviews = await Review.find({ productId: req.params.productId })
        .populate("clientId", "name")
        .sort({ createdAt: -1 });

      res.json(reviews);
    } catch (error) {
      res.status(500).send("Error al obtener las reseñas");
    }
  },

  // Obtener una reseña por ID
  getReviewById: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: "ID de reseña inválido" });
      }

      const review = await Review.findById(req.params.id)
        .populate("clientId", "name")
        .populate("productId", "name");

      if (!review) {
        return res.status(404).json({ msg: "Reseña no encontrada" });
      }
      res.json(review);
    } catch (error) {
      res.status(500).send("Error del servidor");
    }
  },

  // Crear una nueva reseña
  createReview: async (req, res) => {
    const { clientId, productId, score, comment } = req.body;
    try {
      const newReview = new Review({ clientId, productId, score, comment });
      const review = await newReview.save();
      await updateProductRating(productId);

      const populatedReview = await Review.findById(review._id)
        .populate("clientId", "name")
        .populate("productId", "name");

      res.json({ msg: "Reseña creada con éxito", review: populatedReview });
    } catch (error) {
      res.status(500).send("Error al crear la reseña");
    }
  },

  // Actualizar una reseña
  updateReview: async (req, res) => {
    const { score, comment } = req.body;
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: "ID de reseña inválido" });
      }

      let review = await Review.findById(req.params.id);
      if (!review) {
        return res.status(404).json({ msg: "Reseña no encontrada" });
      }

      review = await Review.findByIdAndUpdate(
        req.params.id,
        { $set: { score, comment, updatedAt: Date.now() } },
        { new: true }
      )
        .populate("clientId", "name")
        .populate("productId", "name");

      await updateProductRating(review.productId);
      res.json({ msg: "Reseña actualizada con éxito", review });
    } catch (error) {
      res.status(500).send("Error del servidor");
    }
  },

  // Eliminar una reseña
  deleteReview: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: "ID de reseña inválido" });
      }

      const review = await Review.findById(req.params.id);
      if (!review) {
        return res.status(404).json({ msg: "Reseña no encontrada" });
      }

      await Review.findByIdAndDelete(req.params.id);
      await updateProductRating(review.productId);
      res.json({ msg: "Reseña eliminada" });
    } catch (error) {
      res.status(500).send("Error del servidor");
    }
  }
};

export default reviewsController;
