import Employee from "../models/employees.js";

const employeesController = {};
employeesController.getEmployees = async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
};

employeesController.createEmployee = async (req, res) => {
  const { name, phoneNumber, email, password, hiringDate, dui, Isss } =
    req.body;

  const newEmployee = new Employee({
    name,
    phoneNumber,
    email,
    password,
    hiringDate,
    dui,
    Isss,
  });
  await newEmployee.save();
  res.json("Empleado creado exitosamente");
};

employeesController.deleteEmployee = async (req, res) => {
  const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
  res.json("Empleado eliminado exitosamente");
};

employeesController.updateEmployee = async (req, res) => {
  const { name, phoneNumber, email, password, hiringDate, dui, Isss } =
    req.body;

  const updatedEmployee = await Employee.findByIdAndUpdate(
    req.params.id,
    { name, phoneNumber, email, password, hiringDate, dui, Isss },
    { new: true }
  );
  res.json("Empleado actualizado exitosamente");
};

employeesController.get1Employee = async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    return res.status(404).json({ message: "Empleado no encontrado" });
  }
  res.json(employee);
};

export default employeesController;
