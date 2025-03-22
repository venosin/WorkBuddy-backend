import offersModel from "../models/offers.js";

const offersController = {};

offersController.getOffers = async (req, res) => {
  const offers = await offersModel.find();
  res.json(offers);
};

offersController.createOffer = async (req, res) => {
  const { productId, discountType, percentage, value, from, to, state } =
    req.body;

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
  res.json("Oferta creada exitosamente");
};

offersController.deleteOffer = async (req, res) => {
  const deletedOffer = await offersModel.findByIdAndDelete(req.params.id);
  if (!deletedOffer) {
    return res.status(404).json({ message: "Oferta no encontrada" });
  }
  res.json("Oferta eliminada exitosamente");
};

offersController.updateOffer = async (req, res) => {
  const { productId, discountType, percentage, value, from, to, state } =
    req.body;

  const updatedOffer = await offersModel.findByIdAndUpdate(
    req.params.id,
    { productId, discountType, percentage, value, from, to, state },
    { new: true }
  );
  if (!updatedOffer) {
    return res.status(404).json({ message: "Oferta no encontrada" });
  }
  res.json("Oferta actualizada exitosamente");
};

offersController.get1Offer = async (req, res) => {
  const offer = await offersModel.findById(req.params.id).populate("productId"); // Populate para obtener información de los productos relacionados
  if (!offer) {
    return res.status(404).json({ message: "Oferta no encontrada" });
  }
  res.json(offer);
};

export default offersController;
