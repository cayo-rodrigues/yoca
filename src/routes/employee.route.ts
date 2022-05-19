import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";
import EmployeesController from "../controllers/Employee.controller";
import createEmployeeSchema from "../schemas/createEmployee.schema";

const employeeRoute = Router();

employeeRoute.post(
  "/",
  expressYupMiddleware({ schemaValidator: createEmployeeSchema }),
  EmployeesController.store
);
export default employeeRoute;
