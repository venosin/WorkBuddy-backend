const logoutController = {};
import clientsModel from "../models/clients.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// CREATE: Crea un nuevo modelo
logoutController.logout = async (req, res) => {
   // Borrar la cookie 'authToken' (u otra cookie que uses para el token)
   res.clearCookie('authToken', { httpOnly: true });
 
 
   // Enviar una respuesta indicando que el logout fue exitoso
   return res.status(200).json({ message: 'Logged out successfully' });
 };
 

export default logoutController;