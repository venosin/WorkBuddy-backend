import clientsModel from "../models/Clients.js"
import employeesModel from "../models/Employees.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

const loginController = {};

// CREATE: Login para clientes, empleados y administrador
loginController.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Intento de login con:', { email });

  // Validación de campos requeridos
  if (!email || !password) {
    console.log('Error: Faltan campos');
    return res.status(400).json({ message: "Faltan campos" });
  }

try {
    let userFound;
    let userType;

// Verificar si es el administrador
if (email === config.admin.email && password === config.admin.password) {
    console.log('Login como administrador');
    userType = "admin";
    userFound = { _id: "admin" };
} else {
  // Buscar primero en la colección de empleados
  userFound = await employeesModel.findOne({ email });
  console.log('Búsqueda de empleado:', { encontrado: !!userFound });
  if (userFound) {
    userType = "employees";
    console.log('Usuario encontrado como empleado');
    // Imprimir la contraseña hasheada almacenada para verificar que esté correcta
    console.log('Contraseña en DB:', userFound.password);
    
    let isMatch = false;
    
    // Verificar si la contraseña está hasheada o en texto plano
    if (userFound.password.startsWith('$2')) {
      // La contraseña está hasheada con bcrypt (comienza con $2a$, $2b$, etc.)
      isMatch = await bcrypt.compare(password, userFound.password);
      console.log('Comparando con bcrypt:', isMatch);
    } else {
      // La contraseña está en texto plano, comparar directamente
      isMatch = (password === userFound.password);
      console.log('Comparando texto plano:', isMatch);
      
      // Si la contraseña coincide, actualizarla para que esté hasheada en futuras sesiones
      if (isMatch) {
        try {
          // Hashear y actualizar la contraseña para futuras sesiones
          const salt = await bcrypt.genSalt(10);
          userFound.password = await bcrypt.hash(password, salt);
          await userFound.save();
          console.log('Contraseña actualizada y hasheada para futuras sesiones');
        } catch (err) {
          console.log('Error al actualizar la contraseña:', err);
          // Continuamos aunque falle el guardado del hash
        }
      }
    }
    
    if (!isMatch) {
      console.log('Error: Contraseña inválida para empleado');
      return res.status(401).json({ message: "Invalid password" });
    }
  } else {
   // Si no es un empleado, buscar en la colección de clientes
   userFound = await clientsModel.findOne({ email });
   if (userFound) {
     userType = "clients";
     // Comparar las contraseñas de manera correcta (esperar el resultado de la comparación)
     const isMatch = await bcrypt.compare(password, userFound.password);
     if (!isMatch) {
       return res.status(401).json({ message: "Invalid password" });
     }
   }
 }
}

// Si no se encuentra el usuario en ninguna colección (ni cliente ni empleado), devolver error
if (!userFound) {
    console.log("Usuario no encontrado en ninguna colección");
    return res.status(404).json({ message: "User not found" });
}

//Generar el token JWT

jwt.sign(
    {
        id: userFound._id,
        userType,
    },

    config.jwt.secret,
    {
         expiresIn: config.jwt.expiresIn, 
    },
    (error, token) => {
      if (error) {
        console.error(error);
        return res.json({ message: "Error al generar el token" });
      }

    // Guardar el token en una cookie
      res.cookie("authToken", token, {httpOnly: true });
      res.json({ message: `${userType} login successful`, token });
    }
  );
} catch (error) {
  res.json({ message: "Error", error: error.message });
}
};

export default loginController;


