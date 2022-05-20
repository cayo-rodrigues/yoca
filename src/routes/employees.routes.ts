import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";

import EmployeesController from "../controllers/Employee.controller";

import ensureAdminPermissionMiddleware from "../middlewares/ensureAdminPermission.middleware";


const employeesRoutes = Router();

employeesRoutes.use(ensureAdminPermissionMiddleware);

employeesRoutes.post(
  "/",
  expressYupMiddleware({ schemaValidator: createEmployeeSchema }),
  EmployeesController.store
);

employeesRoutes.get("/", EmployeesController.index);

employeesRoutes.get("/:id", EmployeesController.show);


employeesRoutes.delete("/:id", EmployeesController.delete);

export default employeesRoutes;
