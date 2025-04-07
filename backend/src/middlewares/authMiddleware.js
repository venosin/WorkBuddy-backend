/*
Middleware de autenticación para verificar tokens JWT
*/

import jwt from "jsonwebtoken";
import { config } from "../config.js";

/**
 * Middleware para verificar el token de autenticación
 * Extrae el token de las cookies y verifica su validez
 * Si el token es válido, agrega la información del usuario a req.user
 */
export const verifyToken = (req, res, next) => {
  try {
    // Obtener el token de la cookie
    const token = req.cookies.authToken;
    
    if (!token) {
      return res.status(401).json({ message: "No hay token, acceso denegado" });
    }
    
    // Verificar el token
    jwt.verify(token, config.jwt.secret, (error, decoded) => {
      if (error) {
        console.error("Error al verificar token:", error);
        return res.status(401).json({ message: "Token inválido" });
      }
      
      // Agregar información del usuario a la solicitud
      req.user = {
        userId: decoded.id,
        userType: decoded.userType
      };
      
      next();
    });
  } catch (error) {
    console.error("Error en authMiddleware:", error);
    res.status(500).json({ message: "Error de servidor en autenticación" });
  }
};

/**
 * Middleware para verificar roles específicos
 * @param {Array} roles - Array de roles permitidos ('client', 'employee', 'admin')
 * @returns {Function} Middleware
 */
export const checkRole = (roles) => {
  return (req, res, next) => {
    const { userType } = req.user;
    
    if (!roles.includes(userType)) {
      return res.status(403).json({ 
        message: "Acceso denegado: no tienes permiso para esta operación" 
      });
    }
    
    next();
  };
};
