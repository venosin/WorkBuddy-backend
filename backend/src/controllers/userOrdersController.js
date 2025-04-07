/*
Controlador para gestionar los pedidos del usuario
Incluye métodos para:
- Obtener todos los pedidos del usuario actual
- Obtener detalles de un pedido específico
- Operaciones futuras relacionadas con pedidos
*/

import ordersModel from "../models/Orders.js";
import shoppingCartsModel from "../models/ShoppingCarts.js";

const userOrdersController = {};

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
 * Obtiene todos los pedidos del usuario actual
 */
userOrdersController.getUserOrders = async (req, res) => {
  try {
    const { userId, userType } = getUserInfo(req);
    
    // Primero obtener los carritos de compra del usuario
    // Usamos clienteId que es el campo correcto en el modelo ShoppingCarts
    const userCarts = await shoppingCartsModel.find({ clienteId: userId });
    
    if (!userCarts || userCarts.length === 0) {
      return res.json([]);
    }
    
    // Obtener los IDs de los carritos
    const cartIds = userCarts.map(cart => cart._id);
    
    // Buscar órdenes que contengan estos carritos
    const orders = await ordersModel.find({ CartId: { $in: cartIds } })
      .sort({ createdAt: -1 }) // Ordenar por fecha, más recientes primero
      .populate('CartId'); // Obtener detalles completos del carrito
    
    res.json(orders);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).json({ message: "Error al obtener historial de pedidos", error: error.message });
  }
};

/**
 * Obtiene los detalles de un pedido específico
 */
userOrdersController.getOrderDetails = async (req, res) => {
  try {
    const { userId, userType } = getUserInfo(req);
    const orderId = req.params.orderId;
    
    // Buscar el pedido por su ID
    const order = await ordersModel.findById(orderId)
      .populate({
        path: 'CartId',
        // Ahora usamos la estructura correcta del modelo ShoppingCarts
        populate: {
          path: 'products.idProduct',
          model: 'products'
        }
      });
    
    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }
    
    // Verificar que el pedido tenga un carrito válido
    if (!order.CartId) {
      return res.status(404).json({ message: "El pedido no tiene un carrito asociado válido" });
    }
    
    // Verificar que el pedido pertenezca al usuario actual
    try {
      // Asegurarnos de que order.CartId es un objeto completo (no solo un ID)
      const cartId = typeof order.CartId === 'object' ? order.CartId._id : order.CartId;
      const cart = await shoppingCartsModel.findById(cartId);
      
      if (!cart || cart.clienteId.toString() !== userId.toString()) {
        return res.status(403).json({ message: "No tienes permiso para ver este pedido" });
      }
    } catch (error) {
      console.error("Error al verificar el carrito del pedido:", error);
      return res.status(500).json({ message: "Error al verificar el carrito del pedido" });
    }
    
    res.json(order);
  } catch (error) {
    console.error("Error al obtener detalles del pedido:", error);
    res.status(500).json({ message: "Error al obtener detalles del pedido", error: error.message });
  }
};

/**
 * Obtiene un resumen con el conteo de pedidos por estado
 */
userOrdersController.getOrdersCountByStatus = async (req, res) => {
  try {
    const { userId, userType } = getUserInfo(req);
    
    // Obtener los carritos del usuario
    const userCarts = await shoppingCartsModel.find({ clienteId: userId });
    const cartIds = userCarts.map(cart => cart._id);
    
    // Contar pedidos por estado
    const orders = await ordersModel.find({ CartId: { $in: cartIds } });
    
    // Inicializar contador
    const statusCount = {
      total: orders.length,
      // Puedes agregar más estados según la estructura de tus pedidos
      // Por ejemplo: pendiente, procesando, enviado, entregado, cancelado, etc.
      // Por ahora usamos un valor simple ya que no tenemos implementación de estados
      pendiente: orders.length // Asumimos que todos son pendientes por ahora
    };
    
    res.json(statusCount);
  } catch (error) {
    console.error("Error al obtener conteo de pedidos:", error);
    res.status(500).json({ message: "Error al obtener estadísticas de pedidos", error: error.message });
  }
};

export default userOrdersController;
