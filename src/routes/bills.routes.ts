import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";
import BillsController from "../controllers/Bills.controller";
import verifyAccessLevelMiddleware from "../middlewares/verifyAccessLevel.middleware";
import validateUUIDSchema from "../schemas/validateUUID.schema";

const billsRoutes = Router();

billsRoutes.post("/", verifyAccessLevelMiddleware(3), BillsController.store);
billsRoutes.get("/", verifyAccessLevelMiddleware(3), BillsController.index);

billsRoutes.get(
  "/:id",
  expressYupMiddleware({ schemaValidator: validateUUIDSchema }),
  verifyAccessLevelMiddleware(3),
  BillsController.show
);
billsRoutes.patch(
  "/:id",
  expressYupMiddleware({ schemaValidator: validateUUIDSchema }),
  verifyAccessLevelMiddleware(3),
  BillsController.update
);
billsRoutes.delete(
  "/:id",
  verifyAccessLevelMiddleware(2),
  BillsController.delete
);

export default billsRoutes;
