/*
Controlador para gestionar las operaciones relacionadas con el perfil de usuario
Incluye métodos para:
- Obtener información del perfil
- Actualizar información del perfil
- Subir/actualizar foto de perfil (si es necesario)
*/

import clientModel from "../models/Clients.js";
import employeeModel from "../models/Employees.js";
import { uploadImage, deleteImage } from "../config/cloudinary.js";
import fs from "fs/promises";
import ordersController from "./ordersController.js";

const profileController = {};

/**
 * Determina el modelo y el ID del usuario basado en el tipo de usuario y el JWT
 * @param {Object} req - Objeto de solicitud
 * @returns {Object} - Objeto con el modelo y el ID del usuario
 */
const getUserModelAndId = (req) => {
  // El middleware de autenticación debe haber establecido esta información
  const { userId, userType } = req.user;
  
  let userModel;
  if (userType === "clients") {
    userModel = clientModel;
  } else if (userType === "employees") {
    userModel = employeeModel;
  } else if (userType === "admin") {
    // Para administradores, podemos usar cualquier modelo o manejar de forma especial
    return { userModel: null, userId, userType: "admin" };
  } else {
    throw new Error("Tipo de usuario no válido: " + userType);
  }
  
  return { userModel, userId, userType };
};

/**
 * Obtiene la información del perfil del usuario actual
 */
profileController.getUserProfile = async (req, res) => {
  try {
    const { userModel, userId, userType } = getUserModelAndId(req);
    
    // Si es admin, devolver información básica del administrador
    if (userType === "admin") {
      return res.json({
        _id: userId,
        name: "Administrador",
        role: "admin"
      });
    }
    
    // Buscar el usuario y excluir el campo de contraseña
    const user = await userModel.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    res.json(user);
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    res.status(500).json({ message: "Error al obtener información del perfil", error: error.message });
  }
};

/**
 * Actualiza la información del perfil del usuario actual
 */
profileController.updateUserProfile = async (req, res) => {
  try {
    const { userModel, userId, userType } = getUserModelAndId(req);
    
    // Obtener información actualizada
    const updates = {};
    
    // Campos que se pueden actualizar (ajustar según el modelo)
    const allowedFields = ["name", "phoneNumber", "address"];
    
    // Solo copiar los campos permitidos
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }
    
    // Si hay una imagen de perfil para actualizar
    if (req.file) {
      const user = await userModel.findById(userId);
      
      // Subir la nueva imagen a Cloudinary
      const cloudinaryResult = await uploadImage(
        req.file.path,
        `workbuddy/${userType}_profiles`
      );
      
      // Si el usuario ya tiene una imagen de perfil, eliminarla de Cloudinary
      if (user.profileImage && user.profileImage.public_id) {
        await deleteImage(user.profileImage.public_id);
      }
      
      // Actualizar el campo de imagen de perfil
      updates.profileImage = {
        url: cloudinaryResult.url,
        public_id: cloudinaryResult.public_id,
        filename: cloudinaryResult.original_filename || req.file.originalname
      };
      
      // Eliminar el archivo temporal
      await fs.unlink(req.file.path);
    }
    
    // Actualizar el perfil del usuario
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select("-password");
    
    res.json({
      message: "Perfil actualizado con éxito",
      user: updatedUser
    });
  } catch (error) {
    // Si hay un archivo y ocurre un error, eliminar el archivo temporal
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("Error eliminando el archivo temporal:", unlinkError);
      }
    }
    
    console.error("Error al actualizar el perfil:", error);
    res.status(500).json({ message: "Error al actualizar el perfil", error: error.message });
  }
};

/**
 * Obtiene las órdenes del usuario actual para la sección "Mis Pedidos"
 * Este método actúa como un proxy hacia ordersController.getUserOrders
 */
profileController.getUserOrders = async (req, res) => {
  // Simplemente redirigimos la llamada al controlador de órdenes
  await ordersController.getUserOrders(req, res);
};

export default profileController;
