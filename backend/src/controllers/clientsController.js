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
  try {
    // Extraer los campos del body
    const updateData = {};
    
    // Solo incluir los campos que están presentes en la solicitud
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.phoneNumber !== undefined) updateData.phoneNumber = req.body.phoneNumber;
    if (req.body.email !== undefined) updateData.email = req.body.email;
    if (req.body.password !== undefined && req.body.password.trim() !== '') updateData.password = req.body.password;
    if (req.body.address !== undefined) updateData.address = req.body.address;
    if (req.body.birthday !== undefined) updateData.birthday = req.body.birthday;
    if (req.body.isVerified !== undefined) updateData.isVerified = req.body.isVerified;
    
    console.log("Datos a actualizar:", updateData);
    
    // Usar updateOne en lugar de findByIdAndUpdate
    const result = await clientsModel.updateOne(
      { _id: req.params.id },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Cliente no encontrado" });
    }
    
    // Obtener el cliente actualizado
    const updatedClient = await clientsModel.findById(req.params.id);
    
    res.json({
      success: true,
      message: "Cliente actualizado exitosamente",
      client: updatedClient
    });
  } catch (error) {
    console.error("Error detallado:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar cliente",
      error: error.message
    });
  }
};

// clientsController.updateClient = async (req, res) => {
//   try {
//     const { name, phoneNumber, email, password, address, birthday, isVerified } =
//       req.body;
//     const updatedClient = await clientsModel.findByIdAndUpdate(
//       req.params.id,
//       console.log("Cliente actualizado:", updatedClient),
//       { name, phoneNumber, email, password, address, birthday, isVerified },
//       { new: true }
//     );

//     if (!updatedClient) {
//       return res.status(404).json({ success: false, message: "Cliente no encontrado" });
//     }

//     res.json({
//       success: true,
//       message: "Cliente actualizado exitosamente",
//       client: updatedClient
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error al actualizar cliente",
//       error: error.message
//     });
//   }
// };

clientsController.get1Client = async (req, res) => {
  const client = await clientsModel.findById(req.params.id);
  res.json(client);
};

export default clientsController;
