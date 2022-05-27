import { Router } from "express";

import EmployeesController from "../controllers/Employee.controller";

import verifyAccessLevelMiddleware from "../middlewares/verifyAccessLevel.middleware";
import validateBodyMiddleware from "../middlewares/validateBody.middleware";
import validateUUIDMiddleware from "../middlewares/validateUUID.middleware";

import createEmployeeSchema from "../schemas/employees/createEmployee.schema";
import updateEmployeeSchema from "../schemas/employees/updateEmployee.schema";

const employeesRoutes = Router();

employeesRoutes.use(verifyAccessLevelMiddleware(2));

employeesRoutes.post(
  "/",
  validateBodyMiddleware(createEmployeeSchema),
  EmployeesController.store
);

employeesRoutes.get("/", EmployeesController.index);

employeesRoutes.use("/:id", validateUUIDMiddleware);

employeesRoutes.get("/:id", EmployeesController.show);

employeesRoutes.patch(
  "/:id",
  validateBodyMiddleware(updateEmployeeSchema),
  EmployeesController.update
);

employeesRoutes.delete("/:id", EmployeesController.delete);

export default employeesRoutes;
