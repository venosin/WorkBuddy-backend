import clientsModel from "../models/clients.js";

const clientsController = {};

clientsController.getClients = async (req,res) => {
    const clients = await clientsModel.find();
    res.json(clients);
}

clientsController.createClients = async (req, res) => {
    const {name, phoneNumber,email,password,address,birthday,isVerified} = req.body;
}