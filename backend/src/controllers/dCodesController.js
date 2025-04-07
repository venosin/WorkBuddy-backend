import dCodesModel from "../models/DiscountCodes.js";

const dCodesController = {};

dCodesController.getCodes = async (req, res) => {
  const codes = await dCodesModel.find().populate("clientsId.clientId");
  res.json(codes);
};

dCodesController.createCodes = async (req, res) => {
  const { clientsId, code, percentage, isActive } = req.body;
  const newCode = new dCodesModel({ clientsId, code, percentage, isActive });
  await newCode.save();
  res.json("Codigo de descuento creado");
};

dCodesController.deleteCode = async (req, res) => {
  const code = await dCodesModel.findByIdAndDelete(req.params.id);
  res.json("Codigo de descuento eliminado");
};

dCodesController.updateCode = async (req, res) => {
  const { clientsId, code, percentage, isActive } = req.body;
  const updatedCode = await dCodesModel.findByIdAndUpdate(
    req.params.id,
    { clientsId, code, percentage, isActive },
    { new: true }
  );
  res.json("Codigo de descuento actualizado")
};

dCodesController.getCodeByCode = async (req, res) => {
    const code = await dCodesModel.find({code: req.params.code})
    res.json(code);
  };
dCodesController.getCodeById = async (req, res) => {
    const code = await dCodesModel.findById(req.params.id)
    res.json(code);
  };

export default dCodesController;
