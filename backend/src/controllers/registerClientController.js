import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "../config.js";
import clientsModel from "../models/Clients.js";
import nodemailer from "nodemailer"; // Para envio de correos electronicos
import crypto from "crypto"; // Para generar un código aleatorio

const registerClientController = {};

//CREATE: Registrar un nuevo cliente y envia un codigo de verificacion por correo
registerClientController.register = async (req, res) => {
  const { name, phoneNumber, email, password, address, birthday, isVerified } =
    req.body;

  //Validacion de campos requeridos
  if (
    !name ||
    !phoneNumber ||
    !email ||
    !password ||
    !address ||
    !birthday ||
    isVerified === undefined
  ) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    //Verificacion si el cliente ya existe
    const existingClient = await clientsModel.findOne({ email });
    if (existingClient) {
      return res.status(409).json({ message: "El cliente ya existe" }); //Codigo 409: conflicto
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newClient = new clientsModel({
      name,
      phoneNumber,
      email,
      password: passwordHash,
      address,
      birthday,
      isVerified,
    });

    await newClient.save();

    //Generar un codigo de verificación único
    const verificationCode = crypto.randomBytes(3).toString("hex"); //Codigo corto
    const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 horas de expiración

    //Crear un JWT con el codigo y su expiración
    const tokenCode = jwt.sign(
      {
        email,
        verificationCode,
        expiresAt,
      },
      config.jwt.secret,
      { expiresIn: "2h" } //El jwt expira en 2 horas
    );

    // Guardar el token en una cookie
    res.cookie("verificationToken", tokenCode, {
      httpOnly: true, // La cookie no será accesible desde JavaScript
      secure: process.env.NODE_ENV === "production", // Solo se envía en HTTPS si estás en producción
      maxAge: 2 * 60 * 60 * 1000, // Duración de la cookie: 2 horas
    });

    //Enviar el correo de verificación
    const transporter = nodemailer.createTransport({
      service: "gmail", // Usa tu servicio de correo preferido
      auth: {
        user: config.email.email, // Tu correo electronico
        pass: config.email.password, // La contraseña de la aplicación
      },
    });

    const mailOptions = {
      from: config.email.email, // Tu correo electronico
      to: email,
      subject: "Verificación de correo electrónico",
      text: `Para verificar tu cuenta, utiliza el siguiente código de verificación: ${verificationCode}\nEste código expirará en 2 horas.\nSi no solicitaste este registro, por favor ignora este correo.`,
    };

    //Enviar correo
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error al enviar el correo" });
      }
      console.log("Email enviado:" + info.response);
    });

    // Enviar una respuesta con el código de verificación
    res.status(201).json({
      message:
        "Cliente registrado. Por favor verifica tu correo con el código enviado.",
      token: tokenCode, // Devolver el token para verificación posterior
    });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

// Verificación del correo electrónico al recibir el token
registerClientController.verifyCodeEmail = async (req, res) => {
  const { verificationCode } = req.body;
  const token = req.cookies.verificationToken; //Obtener el token de la cookie

  if (!token) {
    return res
      .status(400)
      .json({ message: "No se proporcionó token de verificación" });
  }

  try {
    // Verificar y decodificar el jwt
    const decoded = jwt.verify(token, config.jwt.secret);
    const { email, verificationCode: storedCode } = decoded;

    //Comparar el código recibido con el almacenado en el JWT
    if (verificationCode !== storedCode) {
      return res
        .status(400)
        .json({ message: "Código de verificación inválido" });
    }

    // Marcar al cliente como verificado
    const client = await clientsModel.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Actualizar el cliente como verificado
    client.isVerified = true;
    await client.save();

    // Limpiar la cookie después de la verificación
    res.clearCookie("verificationToken");

    res.status(200).json({ message: "Correo verificado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al verificar el correo", error: error.message });
  }
};

export default registerClientController;
