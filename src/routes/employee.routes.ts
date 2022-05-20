import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";
import EmployeesController from "../controllers/Employee.controller";
import createEmployeeSchema from "../schemas/employees/createEmployee.schema";

const employeeRoutes = Router();

employeeRoutes.post(
  "/",
  expressYupMiddleware({ schemaValidator: createEmployeeSchema }),
  EmployeesController.store
);
employeeRoutes.get("/", EmployeesController.index);

export default employeeRoutes;
