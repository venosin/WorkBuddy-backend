import clientsModel from "../models/Clients.js";

const clientsController = {};

clientsController.getClients = async (req, res) => {
  const clients = await clientsModel.find();
  res.json(clients);
};

clientsController.createClients = async (req, res) => {
  const { name, phoneNumber, email, password, address, birthday, isVerified } =
    req.body;
  const newClient = new clientsModel({
    name,
    phoneNumber,
    email,
    password,
    address,
    birthday,
    isVerified,
  });
  await newClient.save();
  res.json("Cliente creado con éxitosamente");
};

clientsController.deleteClients = async (req, res) => {
  const deletedClient = await clientsModel.findByIdAndDelete(req.params.id);
  res.json("Cliente eliminado éxitosamente");
};

clientsController.updateClient = async (req, res) => {
  const { name, phoneNumber, email, password, address, birthday, isVerified } =
    req.body;
  const updatedClient = await clientsModel.findByIdAndUpdate(
    req.params.id,
    { name, phoneNumber, email, password, address, birthday, isVerified },
    { new: true }
  );
  res.json("Cliente actualizado éxitosamente");
};

clientsController.get1Client = async (req, res) => {
  const client = await clientsModel.findById(req.params.id);
  res.json(client);
};

export default clientsController;
