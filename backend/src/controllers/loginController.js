import employeeModel from "../models/employees.js";
import clientsModel from "../models/clients.js";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

const loginController = {};

// CREATE: Login para clientes, empleados y administrador
loginController.login = async (req, res) => {
  const { email, password } = req.body;

  // Validación de campos requeridos
  if (!email || !password) {
    return res.status(400).json({ message: "Faltan campos" });
  }

  try {
    let userFound;
    let userType;

    // Verificar si es el administrador
    if (email === config.admin.email && password === config.admin.password) {
      userType = "admin";
      userFound = { _id: "admin" };
    } else {
      // Buscar primero en la coleccion de empleados 
      userFound = await employeeModel.findOne({ email });
      if (userFound) {
        userType = "employee";
        // Comparar las contraseñas de manera correcta (esperar el resultado de la comparación)
        const isPasswordCorrect = await bcrypt.compare(password, userFound.password);
        if (!isPasswordCorrect) {
          return res.json({ message: "Contraseña incorrecta" });
        }
      } else {
        // Si no es un empleado, buscar en la colección de clientes
        userFound = await clientsModel.findOne({ email });
        if (userFound) {
          userType = "Client";
          // Comparar las contraseñas de manera correcta (esperar el resultado de la comparación)
          const isPasswordCorrect = await bcrypt.compare(password, userFound.password);
          if (!isPasswordCorrect) {
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

    // Generar el token JWT
    jsonwebtoken.sign(
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
          console.error("Error al generar el token:", error);
          return res.json({ message: "Error al generar el token" });
        }

        // Guardar el token en una cookie
        res.cookie("authToken", token, { httpOnly: true });
        res.json({ message: "Inicio de sesión exitoso" });
      }
    );
  } catch (error) {
    res.json({ message: "Error", error: error.message });
  }
};

export default loginController;