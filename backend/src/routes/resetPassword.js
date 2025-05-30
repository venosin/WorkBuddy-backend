import { Router } from "express";
import Employee from "../models/Employees.js";
import bcrypt from "bcryptjs";

const router = Router();

// Ruta para actualizar la contraseña de un empleado por email
router.post("/reset-employee-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email y nueva contraseña son requeridos" });
    }
    
    // Validar la longitud mínima de la contraseña
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres" });
    }
    
    // Buscar al empleado por email
    const employee = await Employee.findOne({ email });
    
    if (!employee) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }
    
    // Hashear la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Actualizar la contraseña del empleado
    employee.password = hashedPassword;
    await employee.save();
    
    res.status(200).json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.error("Error al actualizar contraseña:", error);
    res.status(500).json({ message: "Error al actualizar la contraseña", error: error.message });
  }
});

export default router;
