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
    // Obtener el token de la cookie o del header Authorization
    let token = req.cookies?.authToken;
    
    // Si no hay token en las cookies, intentar obtenerlo del header Authorization
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token obtenido del header:', token); // Para depuración
    } else if (token) {
      console.log('Token obtenido de cookies:', token); // Para depuración
    }
    
    if (!token) {
      console.log('No se encontró token en cookies ni en header'); // Para depuración
      return res.status(401).json({ message: "No hay token, acceso denegado" });
    }
    
    // Para depuración
    console.log('Verificando token:', token.substring(0, 10) + '...');
    
    // Verificar el token
    jwt.verify(token, config.jwt.secret, (error, decoded) => {
      if (error) {
        console.error("Error al verificar token:", error);
        return res.status(401).json({ message: "Token inválido" });
      }
      
      console.log('Token verificado con éxito, payload:', decoded);
      
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
export const validateAuthToken = (allowedUserTypes= []) => {

  return (req, res, next) => {
   try { 
      
     //1- Extraer el token de las cookies 
     const {authToken } = req.cookies;

     //2-Imprimir un mensaje de error si no gay cookies
     if(!authToken){
      return res.json({message:"No authentication token found, you must login homie"})
     }
     //3- Extraer la informacion del token
     const decoded = jsonwebtoken.verify(authToken, config.jwt.secret);

     // 4- Verificar si quien inicio sesion es un usuario permitido
     if(!allowedUserTypes.includes(decoded.userType)){
      return res.json({message: "Access denied"})
     }

     //5- Si todo esta bien, continuar con la siguiente funcion
     next();

   }  catch (error){
      console.log("error"+error);
   } 
  }
}
