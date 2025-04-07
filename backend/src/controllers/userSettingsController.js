/*
Controlador para gestionar la configuración y preferencias de los usuarios
Incluye métodos para:
- Obtener la configuración del usuario
- Actualizar preferencias
- Gestionar direcciones (agregar, actualizar, eliminar)
*/

import userSettingsModel from "../models/UserSettings.js";

const userSettingsController = {};

/**
 * Determina el tipo de usuario y el ID del usuario desde el token JWT
 * @param {Object} req - Objeto de solicitud
 * @returns {Object} - Objeto con el ID y tipo de usuario
 */
const getUserInfo = (req) => {
  // El middleware de autenticación debe haber establecido esta información
  const { userId, userType } = req.user;
  return { userId, userType };
};

/**
 * Obtiene o crea las configuraciones del usuario
 */
const getUserSettings = async (userId, userType) => {
  let settings = await userSettingsModel.findOne({ userId, userType });
  
  if (!settings) {
    // Si no existe, crear configuración con valores predeterminados
    settings = new userSettingsModel({
      userId,
      userType,
      addresses: [],
      preferences: {
        notifications: {
          email: true,
          promotions: true,
          orderUpdates: true
        },
        privacy: {
          shareProfileData: false
        }
      }
    });
    await settings.save();
  }
  
  return settings;
};

/**
 * Obtiene la configuración completa del usuario
 */
userSettingsController.getSettings = async (req, res) => {
  try {
    const { userId, userType } = getUserInfo(req);
    const settings = await getUserSettings(userId, userType);
    
    res.json(settings);
  } catch (error) {
    console.error("Error al obtener configuración:", error);
    res.status(500).json({ message: "Error al obtener configuración", error: error.message });
  }
};

/**
 * Actualiza las preferencias del usuario
 */
userSettingsController.updatePreferences = async (req, res) => {
  try {
    const { userId, userType } = getUserInfo(req);
    const { notifications, privacy } = req.body;
    
    // Validar que las preferencias enviadas tengan el formato correcto
    if (!notifications && !privacy) {
      return res.status(400).json({ message: "No se proporcionaron preferencias para actualizar" });
    }
    
    // Obtener la configuración actual
    const settings = await getUserSettings(userId, userType);
    
    // Actualizar solo los campos proporcionados
    if (notifications) {
      if (notifications.email !== undefined) {
        settings.preferences.notifications.email = notifications.email;
      }
      if (notifications.promotions !== undefined) {
        settings.preferences.notifications.promotions = notifications.promotions;
      }
      if (notifications.orderUpdates !== undefined) {
        settings.preferences.notifications.orderUpdates = notifications.orderUpdates;
      }
    }
    
    if (privacy) {
      if (privacy.shareProfileData !== undefined) {
        settings.preferences.privacy.shareProfileData = privacy.shareProfileData;
      }
    }
    
    await settings.save();
    
    res.json({
      message: "Preferencias actualizadas con éxito",
      preferences: settings.preferences
    });
  } catch (error) {
    console.error("Error al actualizar preferencias:", error);
    res.status(500).json({ message: "Error al actualizar preferencias", error: error.message });
  }
};

/**
 * Obtiene todas las direcciones del usuario
 */
userSettingsController.getAddresses = async (req, res) => {
  try {
    const { userId, userType } = getUserInfo(req);
    const settings = await getUserSettings(userId, userType);
    
    res.json(settings.addresses);
  } catch (error) {
    console.error("Error al obtener direcciones:", error);
    res.status(500).json({ message: "Error al obtener direcciones", error: error.message });
  }
};

/**
 * Agrega una nueva dirección
 */
userSettingsController.addAddress = async (req, res) => {
  try {
    const { userId, userType } = getUserInfo(req);
    const { title, street, city, state, postalCode, isDefault } = req.body;
    
    // Validar campos requeridos
    if (!title || !street || !city || !state || !postalCode) {
      return res.status(400).json({ message: "Todos los campos de la dirección son requeridos" });
    }
    
    // Obtener configuración actual
    const settings = await getUserSettings(userId, userType);
    
    // Crear nueva dirección
    const newAddress = {
      title,
      street,
      city,
      state,
      postalCode,
      isDefault: isDefault || false
    };
    
    // Si la nueva dirección es predeterminada, actualizar las otras
    if (newAddress.isDefault) {
      settings.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }
    
    // Agregar la nueva dirección
    settings.addresses.push(newAddress);
    await settings.save();
    
    res.status(201).json({
      message: "Dirección agregada con éxito",
      address: newAddress
    });
  } catch (error) {
    console.error("Error al agregar dirección:", error);
    res.status(500).json({ message: "Error al agregar dirección", error: error.message });
  }
};

/**
 * Actualiza una dirección existente
 */
userSettingsController.updateAddress = async (req, res) => {
  try {
    const { userId, userType } = getUserInfo(req);
    const addressId = req.params.addressId;
    const updates = req.body;
    
    // Obtener configuración actual
    const settings = await getUserSettings(userId, userType);
    
    // Encontrar la dirección por su ID
    const addressIndex = settings.addresses.findIndex(addr => addr._id.toString() === addressId);
    
    if (addressIndex === -1) {
      return res.status(404).json({ message: "Dirección no encontrada" });
    }
    
    // Actualizar campos proporcionados
    if (updates.title) settings.addresses[addressIndex].title = updates.title;
    if (updates.street) settings.addresses[addressIndex].street = updates.street;
    if (updates.city) settings.addresses[addressIndex].city = updates.city;
    if (updates.state) settings.addresses[addressIndex].state = updates.state;
    if (updates.postalCode) settings.addresses[addressIndex].postalCode = updates.postalCode;
    
    // Si se está estableciendo como predeterminada, actualizar las otras
    if (updates.isDefault) {
      settings.addresses.forEach((addr, index) => {
        addr.isDefault = index === addressIndex;
      });
    }
    
    await settings.save();
    
    res.json({
      message: "Dirección actualizada con éxito",
      address: settings.addresses[addressIndex]
    });
  } catch (error) {
    console.error("Error al actualizar dirección:", error);
    res.status(500).json({ message: "Error al actualizar dirección", error: error.message });
  }
};

/**
 * Elimina una dirección
 */
userSettingsController.deleteAddress = async (req, res) => {
  try {
    const { userId, userType } = getUserInfo(req);
    const addressId = req.params.addressId;
    
    // Obtener configuración actual
    const settings = await getUserSettings(userId, userType);
    
    // Encontrar y eliminar la dirección
    const addressIndex = settings.addresses.findIndex(addr => addr._id.toString() === addressId);
    
    if (addressIndex === -1) {
      return res.status(404).json({ message: "Dirección no encontrada" });
    }
    
    // Verificar si es la dirección predeterminada
    const isDefault = settings.addresses[addressIndex].isDefault;
    
    // Eliminar la dirección
    settings.addresses.splice(addressIndex, 1);
    
    // Si era la predeterminada y quedan otras direcciones, establecer la primera como predeterminada
    if (isDefault && settings.addresses.length > 0) {
      settings.addresses[0].isDefault = true;
    }
    
    await settings.save();
    
    res.json({ message: "Dirección eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar dirección:", error);
    res.status(500).json({ message: "Error al eliminar dirección", error: error.message });
  }
};

export default userSettingsController;
