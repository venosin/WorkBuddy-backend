/*
Servicio de notificaciones para WorkBuddy
Gestiona el envío de notificaciones por email cuando:
- Se completa un pago
- Cambia el estado de una orden
- Otros eventos importantes
*/

import nodemailer from "nodemailer";
import { config } from "../config.js";
import clientModel from "../models/Clients.js";

// Configuración del servicio de email
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.email.user,
        pass: config.email.pass
    }
});

const notificationService = {};

/**
 * Envía notificación por email cuando se completa un pago
 */
notificationService.sendPaymentCompletedEmail = async (userId, order) => {
    try {
        // Obtener información del usuario
        const user = await clientModel.findById(userId);
        if (!user || !user.email) {
            throw new Error("Usuario o email no encontrado");
        }
        
        // Formatear fecha para la notificación
        const formattedDate = new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Construir el email
        const mailOptions = {
            from: `"WorkBuddy" <${config.email.user}>`,
            to: user.email,
            subject: `Pago Confirmado: Pedido #${order._id}`,
            html: `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                    <div style="background-color: #4A90E2; padding: 15px; text-align: center;">
                        <h1 style="color: white; margin: 0;">¡Pago Confirmado!</h1>
                    </div>
                    <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
                        <p>Hola ${user.name},</p>
                        <p>¡Excelentes noticias! Tu pago para el pedido #${order._id} ha sido confirmado y está siendo procesado.</p>
                        <div style="background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-radius: 5px;">
                            <h3>Detalles del Pedido:</h3>
                            <p><strong>Número de pedido:</strong> ${order._id}</p>
                            <p><strong>Fecha:</strong> ${formattedDate}</p>
                            <p><strong>Total:</strong> $${order.totalAmount.toFixed(2)}</p>
                            <p><strong>Estado:</strong> Pagado</p>
                        </div>
                        <p>Puedes seguir el estado de tu pedido en cualquier momento iniciando sesión en tu cuenta WorkBuddy.</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="http://localhost:5173/profile/orders" style="background-color: #4A90E2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ver Mi Pedido</a>
                        </div>
                        <p>Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.</p>
                        <p>Gracias por tu compra,<br>El equipo de WorkBuddy</p>
                    </div>
                    <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #777;">
                        <p>© 2025 WorkBuddy. Todos los derechos reservados.</p>
                    </div>
                </div>
            `
        };
        
        // Enviar el email
        const info = await transporter.sendMail(mailOptions);
        console.log(`Notificación de pago enviada: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error("Error al enviar notificación de pago:", error);
        return false;
    }
};

/**
 * Envía notificación por email cuando cambia el estado de una orden
 */
notificationService.sendOrderStatusUpdateEmail = async (userId, order) => {
    try {
        // Obtener información del usuario
        const user = await clientModel.findById(userId);
        if (!user || !user.email) {
            throw new Error("Usuario o email no encontrado");
        }
        
        // Mapeo de estados a mensajes amigables
        const statusMessages = {
            "processing": "¡Tu pedido está siendo procesado!",
            "shipped": "¡Tu pedido ha sido enviado!",
            "delivered": "¡Tu pedido ha sido entregado!",
            "cancelled": "Tu pedido ha sido cancelado"
        };
        
        const statusMessage = statusMessages[order.status] || `El estado de tu pedido ha cambiado a: ${order.status}`;
        
        // Construir el email
        const mailOptions = {
            from: `"WorkBuddy" <${config.email.user}>`,
            to: user.email,
            subject: `Actualización de Pedido #${order._id}: ${statusMessage}`,
            html: `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                    <div style="background-color: #4A90E2; padding: 15px; text-align: center;">
                        <h1 style="color: white; margin: 0;">Actualización de Pedido</h1>
                    </div>
                    <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
                        <p>Hola ${user.name},</p>
                        <p>${statusMessage}</p>
                        <div style="background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-radius: 5px;">
                            <h3>Detalles del Pedido:</h3>
                            <p><strong>Número de pedido:</strong> ${order._id}</p>
                            <p><strong>Estado actual:</strong> ${order.status}</p>
                        </div>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="http://localhost:5173/profile/orders" style="background-color: #4A90E2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ver Mi Pedido</a>
                        </div>
                        <p>Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.</p>
                        <p>Saludos,<br>El equipo de WorkBuddy</p>
                    </div>
                    <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #777;">
                        <p>© 2025 WorkBuddy. Todos los derechos reservados.</p>
                    </div>
                </div>
            `
        };
        
        // Enviar el email
        const info = await transporter.sendMail(mailOptions);
        console.log(`Notificación de cambio de estado enviada: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error("Error al enviar notificación de estado:", error);
        return false;
    }
};

/**
 * Registra la notificación en la base de datos (opcional)
 * Esto permite llevar un registro histórico de notificaciones
 */
notificationService.recordNotification = async (userId, orderId, type, status = "sent") => {
    try {
        // Aquí podrías implementar un registro de notificaciones en la base de datos
        // Si tienes un modelo de Notifications, podrías usarlo aquí
        console.log(`Notificación ${type} registrada para usuario ${userId}, orden ${orderId}`);
        return true;
    } catch (error) {
        console.error("Error al registrar notificación:", error);
        return false;
    }
};

export default notificationService;
