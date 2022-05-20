import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";

import EmployeesController from "../controllers/Employee.controller";


const employeesRoutes = Router();

employeesRoutes.post(
  "/",
  expressYupMiddleware({ schemaValidator: createEmployeeSchema }),
  EmployeesController.store
);

employeesRoutes.get("/", EmployeesController.index);

employeesRoutes.get("/:id", EmployeesController.show);

export default employeesRoutes;
