import offersModel from "../models/Offers.js";

const offersController = {};

offersController.getOffers = async (req, res) => {
  try {
    const offers = await offersModel.find().populate("productId");
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las ofertas", error: error.message });
  }
};

offersController.createOffer = async (req, res) => {
  try {
    const { productId, discountType, percentage, value, from, to, state } =
      req.body;

    // Basic validation (can be expanded with a library like Joi)
    if (!productId || !discountType || !from || !to || !state) {
      return res.status(400).json({ message: "Faltan campos obligatorios." });
    }
    if (discountType === 'percentage' && (percentage === undefined || percentage < 0 || percentage > 100)) {
      return res.status(400).json({ message: "Porcentaje inválido para el tipo de descuento."} );
    }
    if (discountType === 'fixed_value' && (value === undefined || value < 0)) {
      return res.status(400).json({ message: "Valor inválido para el tipo de descuento."} );
    }
    if (new Date(from) >= new Date(to)) {
      return res.status(400).json({ message: "La fecha 'desde' debe ser anterior a la fecha 'hasta'." });
    }

    const newOffer = new offersModel({
      productId,
      discountType,
      percentage,
      value,
      from,
      to,
      state,
    });
    await newOffer.save();
    res.status(201).json({ message: "Oferta creada exitosamente", offer: newOffer });
  } catch (error) {
    // Handle Mongoose validation errors specifically if needed
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: "Error de validación", errors: error.errors });
    }
    res.status(500).json({ message: "Error al crear la oferta", error: error.message });
  }
};

offersController.deleteOffer = async (req, res) => {
  try {
    const deletedOffer = await offersModel.findByIdAndDelete(req.params.id);
    if (!deletedOffer) {
      return res.status(404).json({ message: "Oferta no encontrada" });
    }
    res.json({ message: "Oferta eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la oferta", error: error.message });
  }
};

offersController.updateOffer = async (req, res) => {
  try {
    const { productId, discountType, percentage, value, from, to, state } =
      req.body;

    // Basic validation (can be expanded)
    if (from && to && new Date(from) >= new Date(to)) {
      return res.status(400).json({ message: "La fecha 'desde' debe ser anterior a la fecha 'hasta'." });
    }
    if (discountType === 'percentage' && percentage !== undefined && (percentage < 0 || percentage > 100)) {
      return res.status(400).json({ message: "Porcentaje inválido."} );
    }
    if (discountType === 'fixed_value' && value !== undefined && value < 0) {
      return res.status(400).json({ message: "Valor inválido."} );
    }

    const updatedOffer = await offersModel.findByIdAndUpdate(
      req.params.id,
      { productId, discountType, percentage, value, from, to, state },
      { new: true, runValidators: true } // runValidators to ensure schema validation on update
    );
    if (!updatedOffer) {
      return res.status(404).json({ message: "Oferta no encontrada" });
    }
    res.json({ message: "Oferta actualizada exitosamente", offer: updatedOffer });
  } catch (error) {
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: "Error de validación al actualizar", errors: error.errors });
    }
    res.status(500).json({ message: "Error al actualizar la oferta", error: error.message });
  }
};

offersController.get1Offer = async (req, res) => {
  try {
    const offer = await offersModel.findById(req.params.id).populate("productId");
    if (!offer) {
      return res.status(404).json({ message: "Oferta no encontrada" });
    }
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la oferta", error: error.message });
  }
};

export default offersController;
