/*
Controlador para gestionar los productos favoritos de los usuarios
Incluye métodos para:
- Obtener la lista de favoritos
- Agregar un producto a favoritos
- Eliminar un producto de favoritos
*/

import favoritesModel from "../models/Favorites.js";
import productsModel from "../models/Products.js";

const favoritesController = {};

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
 * Obtiene los productos favoritos del usuario actual
 */
favoritesController.getFavorites = async (req, res) => {
  try {
    const { userId, userType } = getUserInfo(req);
    
    // Buscar o crear el documento de favoritos del usuario
    let userFavorites = await favoritesModel.findOne({ userId, userType });
    
    if (!userFavorites) {
      // Si no existe, crear un nuevo documento de favoritos vacío
      userFavorites = new favoritesModel({
        userId,
        userType,
        products: []
      });
      await userFavorites.save();
    }
    
    // Obtener la información completa de los productos marcados como favoritos
    const favoriteProducts = await productsModel.find({
      _id: { $in: userFavorites.products }
    });
    
    res.json(favoriteProducts);
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    res.status(500).json({ message: "Error al obtener productos favoritos", error: error.message });
  }
};

/**
 * Agrega un producto a la lista de favoritos del usuario
 */
favoritesController.addToFavorites = async (req, res) => {
  try {
    const { userId, userType } = getUserInfo(req);
    const productId = req.params.productId;
    
    // Verificar que el producto exista
    const productExists = await productsModel.exists({ _id: productId });
    if (!productExists) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    
    // Buscar el documento de favoritos del usuario o crear uno nuevo
    let userFavorites = await favoritesModel.findOne({ userId, userType });
    
    if (!userFavorites) {
      userFavorites = new favoritesModel({
        userId,
        userType,
        products: [productId]
      });
    } else if (!userFavorites.products.includes(productId)) {
      // Solo agregar si no está ya en la lista
      userFavorites.products.push(productId);
    } else {
      return res.status(400).json({ message: "El producto ya está en favoritos" });
    }
    
    await userFavorites.save();
    
    res.json({
      message: "Producto agregado a favoritos",
      productId
    });
  } catch (error) {
    console.error("Error al agregar a favoritos:", error);
    res.status(500).json({ message: "Error al agregar a favoritos", error: error.message });
  }
};

/**
 * Elimina un producto de la lista de favoritos del usuario
 */
favoritesController.removeFromFavorites = async (req, res) => {
  try {
    const { userId, userType } = getUserInfo(req);
    const productId = req.params.productId;
    
    // Buscar el documento de favoritos del usuario
    const userFavorites = await favoritesModel.findOne({ userId, userType });
    
    if (!userFavorites) {
      return res.status(404).json({ message: "No tienes lista de favoritos" });
    }
    
    // Verificar si el producto está en la lista de favoritos
    const productIndex = userFavorites.products.indexOf(productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: "Producto no encontrado en favoritos" });
    }
    
    // Eliminar el producto de la lista
    userFavorites.products.splice(productIndex, 1);
    await userFavorites.save();
    
    res.json({
      message: "Producto eliminado de favoritos",
      productId
    });
  } catch (error) {
    console.error("Error al eliminar de favoritos:", error);
    res.status(500).json({ message: "Error al eliminar de favoritos", error: error.message });
  }
};

export default favoritesController;

