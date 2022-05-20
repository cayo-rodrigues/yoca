import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";

import EmployeesController from "../controllers/Employee.controller";

import ensureAdminPermissionMiddleware from "../middlewares/ensureAdminPermission.middleware";

import createEmployeeSchema from "../schemas/employees/updateEmployee.schema";
import updateEmployeeSchema from "../schemas/employees/updateEmployee.schema";

const employeesRoutes = Router();

employeesRoutes.use(ensureAdminPermissionMiddleware);

employeesRoutes.post(
  "/",
  expressYupMiddleware({ schemaValidator: createEmployeeSchema }),
  EmployeesController.store
);

employeesRoutes.get("/", EmployeesController.index);

employeesRoutes.get("/:id", EmployeesController.show);

employeesRoutes.patch(
  "/:id",
  expressYupMiddleware({ schemaValidator: updateEmployeeSchema }),
  EmployeesController.update
);

employeesRoutes.delete("/:id", EmployeesController.delete);

export default employeesRoutes;
