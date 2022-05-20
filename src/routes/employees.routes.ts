import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";

import EmployeesController from "../controllers/Employee.controller";

employeesRoutes.post(
  "/",
  expressYupMiddleware({ schemaValidator: createEmployeeSchema }),
  EmployeesController.store
);

employeesRoutes.get("/", EmployeesController.index);

export default employeesRoutes;
