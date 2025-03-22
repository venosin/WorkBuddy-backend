import Review from "../models/Reviews.js";
import Product from "../models/Products.js";

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
    console.error(error);
    res.status(500).json({ msg: "Error al obtener las reseñas" });
  }
},

  // Obtener todas las reseñas de un producto
  getProductReviews: async (req, res) => {
    try {
      const reviews = await Review.find({ productId: req.params.productId })
        .populate("clientId", "name")
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
        .populate("clientId", "name")
        .populate("productId", "name");

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
    const { clientId, productId, score, comment } = req.body;

    // Validación de datos
    if (!clientId || !productId || !score || !comment) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    if (score < 1 || score > 5) {
      return res.status(400).json({ msg: "La puntuación debe estar entre 1 y 5" });
    }

    try {
      const existingReview = await Review.findOne({ clientId, productId });

      if (existingReview) {
        return res.status(400).json({ msg: "Ya has hecho una reseña de este producto" });
      }

      const newReview = new Review({ clientId, productId, score, comment });

      const review = await newReview.save();
      await reviewsController.updateProductRating(productId);

      const populatedReview = await Review.findById(review._id)
        .populate("clientId", "name")
        .populate("productId", "name");

      res.json({ msg: "Reseña creada con éxito", review: populatedReview });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al crear la reseña");
    }
  },

  // Actualizar una reseña
  updateReview: async (req, res) => {
    const { clientId, score, comment } = req.body;

    if (!clientId || !score || !comment) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    if (score < 1 || score > 5) {
      return res.status(400).json({ msg: "La puntuación debe estar entre 1 y 5" });
    }

    try {
      let review = await Review.findById(req.params.id);

      if (!review) {
        return res.status(404).json({ msg: "Reseña no encontrada" });
      }

      if (review.clientId.toString() !== clientId) {
        return res.status(401).json({ msg: "No autorizado" });
      }

      review = await Review.findByIdAndUpdate(
        req.params.id,
        { $set: { score, comment, updatedAt: Date.now() } },
        { new: true }
      )
        .populate("clientId", "name")
        .populate("productId", "name");

      await reviewsController.updateProductRating(review.productId);
      res.json(review);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error del servidor");
    }
  },

  // Eliminar una reseña
  deleteReview: async (req, res) => {
    const { clientId } = req.body;

    if (!clientId) {
      return res.status(400).json({ msg: "El clientId es obligatorio" });
    }

    try {
      const review = await Review.findById(req.params.id);
      if (!review) {
        return res.status(404).json({ msg: "Reseña no encontrada" });
      }

      if (review.clientId.toString() !== clientId) {
        return res.status(401).json({ msg: "No autorizado" });
      }

      const productId = review.productId;
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
    const { clientId } = req.body;

    if (!clientId) {
      return res.status(400).json({ msg: "El clientId es obligatorio" });
    }

    try {
      const reviews = await Review.find({ clientId })
        .populate("productId", "name")
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
      const reviews = await Review.find({ productId });
      if (reviews.length === 0) {
        await Product.findByIdAndUpdate(productId, { averageRating: 0, numberOfReviews: 0 });
        return;
      }

      const totalScore = reviews.reduce((sum, review) => sum + review.score, 0);
      const averageRating = totalScore / reviews.length;

      await Product.findByIdAndUpdate(productId, { averageRating, numberOfReviews: reviews.length });
    } catch (error) {
      console.error("Error al actualizar la calificación del producto:", error);
    }
  },
};

export default reviewsController;
