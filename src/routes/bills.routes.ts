import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";

import BillsController from "../controllers/Bills.controller";

import verifyAccessLevelMiddleware from "../middlewares/verifyAccessLevel.middleware";

import validateNumberIdSchema from "../schemas/validateNumberId.schema";

const billsRoutes = Router();

billsRoutes.post("/", verifyAccessLevelMiddleware(3), BillsController.store);
billsRoutes.get("/", verifyAccessLevelMiddleware(3), BillsController.index);

billsRoutes.get(
  "/:id",
  verifyAccessLevelMiddleware(3),
  expressYupMiddleware({ schemaValidator: validateNumberIdSchema }),
  BillsController.show
);
billsRoutes.patch(
  "/:id",
  verifyAccessLevelMiddleware(3),
  expressYupMiddleware({ schemaValidator: validateNumberIdSchema }),
  BillsController.update
);
billsRoutes.delete(
  "/:id",
  verifyAccessLevelMiddleware(2),
  expressYupMiddleware({ schemaValidator: validateNumberIdSchema }),
  BillsController.delete
);

export default billsRoutes;
