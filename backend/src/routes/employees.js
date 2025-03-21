import express from "express";
import employeesController from "../controllers/employeesController.js";

const router = express.Router();

router
  .route("/")
  .get(employeesController.getEmployees)
  .post(employeesController.createEmployee);

router
  .route("/:id")
  .get(employeesController.get1Employee)
  .put(employeesController.updateEmployee)
  .delete(employeesController.deleteEmployee);

export default router;
