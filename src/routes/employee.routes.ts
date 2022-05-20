import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";
import EmployeesController from "../controllers/Employee.controller";
import ensureAdminPermissionMiddleware from "../middlewares/ensureAdminPermission.middleware";
import createEmployeeSchema from "../schemas/employees/createEmployee.schema";

const employeeRoute = Router();

employeeRoute.post(
  "/",
  expressYupMiddleware({ schemaValidator: createEmployeeSchema }),
  EmployeesController.store
);

employeeRoute.use(ensureAdminPermissionMiddleware);

employeeRoute.get("/", EmployeesController.index);

employeeRoute.get("/:id", EmployeesController.show);

employeeRoute.delete("/:id", EmployeesController.delete);

export default employeeRoute;
