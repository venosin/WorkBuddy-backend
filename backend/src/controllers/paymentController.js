/*
Controlador para gestionar pagos a través de PayPal
Incluye métodos para:
- Crear un pago (createPayment): Inicia el proceso de pago con PayPal
- Capturar el pago (capturePayment): Completa la transacción y actualiza la orden
- Cancelar el pago (cancelPayment): Maneja cancelaciones
*/

import paypal from "@paypal/checkout-server-sdk";
import { config } from "../config.js";
import ordersModel from "../models/Orders.js"; 
import shoppingCartsModel from "../models/ShoppingCarts.js";
import UserSettings from "../models/UserSettings.js";
import notificationService from "../services/notificationService.js";

// Configuración de PayPal
const clientId = config.paypal.clientId;
const clientSecret = config.paypal.clientSecret;

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

// Crear el objeto del controlador
const paymentController = {};

/**
 * Obtiene el monto total de un carrito de compras
 */
const getCartTotal = async (cartId) => {
  try {
    const cart = await shoppingCartsModel.findById(cartId).populate('products.idProduct');
    
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }
    
    let total = 0;
    for (const item of cart.products) {
      // Verificar que el producto tenga un precio válido
      if (item.idProduct && item.idProduct.price) {
        total += item.idProduct.price * item.quantity;
      }
    }
    
    return parseFloat(total.toFixed(2)); // Redondear a 2 decimales
  } catch (error) {
    console.error("Error al calcular el total del carrito:", error);
    throw error;
  }
};

/**
 * Función para crear un pago
 * Recibe: orderId, cartId
 * Retorna: URL de PayPal para completar el pago
 */
paymentController.createPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ message: "Se requiere el ID de la orden" });
    }
    
    // Obtener la orden
    const order = await ordersModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }
    
    // Verificar que la orden esté pendiente
    if (order.status !== "pending") {
      return res.status(400).json({ message: "Esta orden ya ha sido procesada" });
    }
    
    // Obtener el total del carrito
    const totalAmount = order.totalAmount || await getCartTotal(order.CartId);
    
    // Crear la solicitud de pago a PayPal
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalAmount.toString(),
          },
          description: `Orden WorkBuddy #${order._id}`,
        },
      ],
      application_context: {
        locale: "es-SV", // Idioma español con configuración de El Salvador
        shipping_preference: "NO_SHIPPING", // La dirección ya está en la orden
        user_action: "PAY_NOW",
        return_url: "http://localhost:5173/checkout/success",
        cancel_url: "http://localhost:5173/checkout/cancel",
      },
    });

    // Ejecutar la solicitud
    const paypalOrder = await client.execute(request);
    
    // Actualizar la orden con la información inicial del pago
    order.paymentInfo.transactionId = paypalOrder.result.id;
    await order.save();
    
    // Enviar la respuesta con los enlaces para continuar con el proceso
    res.json({ 
      id: paypalOrder.result.id,
      links: paypalOrder.result.links,
      // Enviamos el link de aprobación para redirigir al usuario
      approveUrl: paypalOrder.result.links.find(link => link.rel === "approve").href
    });
  } catch (err) {
    console.error("Error al crear el pago:", err);
    res.status(500).json({ message: "Error al crear el pago", error: err.message });
  }
};

/**
 * Función para capturar el pago una vez aprobado por el usuario
 * Recibe: orderID (ID de la orden de PayPal), orderId (ID de nuestra orden)
 */
paymentController.capturePayment = async (req, res) => {
  try {
    const { paypalOrderId, orderId } = req.body;
    
    if (!paypalOrderId || !orderId) {
      return res.status(400).json({ message: "Se requieren los IDs de la orden" });
    }
    
    // Obtener la orden de nuestra base de datos
    const order = await ordersModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }
    
    // Capturar el pago en PayPal
    const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
    request.requestBody({});
    
    const capture = await client.execute(request);
    
    // Actualizar el estado de la orden en nuestra base de datos
    order.paymentInfo.status = "completed";
    order.paymentInfo.paymentDate = new Date();
    order.status = "paid";
    await order.save();
    
    // Enviar notificación al usuario
    if (!order.notificationSent) {
      try {
        // Determinar el ID de usuario desde la orden
        const userId = order.userId;
        
        // Si el modelo actualizado ya tiene el campo userId, usar directamente
        if (userId) {
          // Enviar notificación por email
          const emailSent = await notificationService.sendPaymentCompletedEmail(userId, order);
          
          // Registrar notificación en la base de datos (opcional)
          await notificationService.recordNotification(userId, order._id, "payment_completed");
          
          // Marcar la orden como notificada
          order.notificationSent = true;
          await order.save();
          
          console.log(`Notificación enviada para orden ${order._id}: ${emailSent ? 'Éxito' : 'Fallida'}`);
        } else {
          // Para órdenes antiguas que no tienen el campo userId
          // Podemos intentar obtener el usuario a través del carrito
          const cart = await shoppingCartsModel.findById(order.CartId);
          if (cart && cart.clienteId) {
            // Enviar notificación por email
            const emailSent = await notificationService.sendPaymentCompletedEmail(cart.clienteId, order);
            
            // Registrar notificación
            await notificationService.recordNotification(cart.clienteId, order._id, "payment_completed");
            
            // Marcar la orden como notificada
            order.notificationSent = true;
            await order.save();
            
            console.log(`Notificación enviada (desde carrito) para orden ${order._id}: ${emailSent ? 'Éxito' : 'Fallida'}`);
          }
        }
      } catch (notificationError) {
        // No interrumpimos el flujo principal si hay error en notificación
        console.error("Error al enviar notificación:", notificationError);
      }
    }
    
    res.json({ 
      status: capture.result.status,
      orderId: order._id,
      message: "Pago completado con éxito"
    });
  } catch (err) {
    console.error("Error al capturar el pago:", err);
    res.status(500).json({ message: "Error al capturar el pago", error: err.message });
  }
};

/**
 * Función para cancelar un pago
 */
paymentController.cancelPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ message: "Se requiere el ID de la orden" });
    }
    
    // Obtener la orden
    const order = await ordersModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }
    
    // Actualizar el estado de la orden
    order.paymentInfo.status = "failed";
    order.status = "cancelled";
    await order.save();
    
    res.json({ 
      status: "cancelled",
      orderId: order._id,
      message: "Pago cancelado"
    });
  } catch (err) {
    console.error("Error al cancelar el pago:", err);
    res.status(500).json({ message: "Error al cancelar el pago", error: err.message });
  }
};

/**
 * Iniciar proceso de pago para una orden existente
 * Esta función actualiza una orden existente para prepararla para el pago con PayPal
 */
paymentController.initPaymentProcess = async (req, res) => {
  try {
    const { orderId } = req.body;
    const { userId } = req.user; // Obtenido del middleware de autenticación
    
    if (!orderId) {
      return res.status(400).json({ message: "Se requiere el ID de la orden" });
    }
    
    // Obtener la orden existente
    const order = await ordersModel.findById(orderId).populate('CartId');
    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }
    
    // Verificar que la orden pertenece al usuario actual
    const cart = await shoppingCartsModel.findById(order.CartId._id);
    if (!cart || cart.clienteId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "No tienes permiso para acceder a esta orden" });
    }
    
    // Calcular el total del carrito si no está establecido
    if (!order.totalAmount) {
      const totalAmount = await getCartTotal(order.CartId._id);
      order.totalAmount = totalAmount;
      await order.save();
    }
    
    // Actualizar información de pago si es necesario
    if (!order.paymentInfo) {
      order.paymentInfo = {
        method: "paypal", // Por defecto usamos PayPal
        status: "pending"
      };
      await order.save();
    }
    
    res.status(200).json({
      message: "Orden preparada para pago",
      order: order
    });
  } catch (err) {
    console.error("Error al preparar orden para pago:", err);
    res.status(500).json({ message: "Error al preparar orden para pago", error: err.message });
  }
};

/**
 * Obtener el estado de un pago
 */
paymentController.getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    if (!orderId) {
      return res.status(400).json({ message: "Se requiere el ID de la orden" });
    }
    
    // Obtener la orden
    const order = await ordersModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }
    
    res.json({
      orderId: order._id,
      status: order.status,
      paymentStatus: order.paymentInfo.status,
      paymentMethod: order.paymentInfo.method,
      transactionId: order.paymentInfo.transactionId,
      paymentDate: order.paymentInfo.paymentDate
    });
  } catch (err) {
    console.error("Error al obtener el estado del pago:", err);
    res.status(500).json({ message: "Error al obtener el estado del pago", error: err.message });
  }
};

// Exportar el controlador
export default paymentController;
