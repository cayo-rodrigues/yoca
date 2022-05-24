import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";

import EmployeesController from "../controllers/Employee.controller";

import verifyAccessLevelMiddleware from "../middlewares/verifyAccessLevel.middleware";

import createEmployeeSchema from "../schemas/employees/updateEmployee.schema";
import updateEmployeeSchema from "../schemas/employees/updateEmployee.schema";
import validateUUIDSchema from "../schemas/validateUUID.schema";

const employeesRoutes = Router();

employeesRoutes.use(verifyAccessLevelMiddleware(2));

employeesRoutes.post(
  "/",
  expressYupMiddleware({ schemaValidator: createEmployeeSchema }),
  EmployeesController.store
);

employeesRoutes.get("/", EmployeesController.index);

employeesRoutes.use(
  "/:id",
  expressYupMiddleware({ schemaValidator: validateUUIDSchema })
);

employeesRoutes.get("/:id", EmployeesController.show);

employeesRoutes.patch(
  "/:id",
  expressYupMiddleware({ schemaValidator: updateEmployeeSchema }),
  EmployeesController.update
);

employeesRoutes.delete("/:id", EmployeesController.delete);

export default employeesRoutes;
