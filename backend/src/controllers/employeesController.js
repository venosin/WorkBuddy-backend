import Employee from "../models/Employees.js";
import bcrypt from "bcryptjs";

const employeesController = {};
employeesController.getEmployees = async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
};

employeesController.createEmployee = async (req, res) => {
  try {
    const { name, phoneNumber, email, password, hiringDate, dui, Isss } = req.body;
    
    // Verificar si ya existe un empleado con ese email
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: "El correo electrónico ya está en uso" });
    }
    
    // Hashear la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newEmployee = new Employee({
      name,
      phoneNumber,
      email,
      password: hashedPassword, // Guardar la contraseña hasheada
      hiringDate,
      dui,
      Isss,
    });
    
    await newEmployee.save();
    res.status(201).json({ message: "Empleado creado exitosamente" });
  } catch (error) {
    console.error("Error al crear empleado:", error);
    res.status(500).json({ message: "Error al crear el empleado", error: error.message });
  }
};

employeesController.deleteEmployee = async (req, res) => {
  const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
  res.json("Empleado eliminado exitosamente");
};

employeesController.updateEmployee = async (req, res) => {
  try {
    const { name, phoneNumber, email, password, hiringDate, dui, Isss } = req.body;
    
    // Verificamos si existe el empleado
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }
    
    // Verificamos si el correo ya existe (si se está cambiando)
    if (email !== employee.email) {
      const existingEmployee = await Employee.findOne({ email });
      if (existingEmployee) {
        return res.status(400).json({ message: "El correo electrónico ya está en uso" });
      }
    }
    
    // Creamos el objeto con los datos a actualizar
    const updateData = { name, phoneNumber, email, hiringDate, dui, Isss };
    
    // Si se proporciona una contraseña nueva, la hasheamos
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    res.json({ message: "Empleado actualizado exitosamente", employee: updatedEmployee });
  } catch (error) {
    console.error("Error al actualizar empleado:", error);
    res.status(500).json({ message: "Error al actualizar el empleado", error: error.message });
  }
};

employeesController.get1Employee = async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    return res.status(404).json({ message: "Empleado no encontrado" });
  }
  res.json(employee);
};

export default employeesController;
