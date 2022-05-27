import { Router } from "express";

import BillsController from "../controllers/Bills.controller";

import verifyAccessLevelMiddleware from "../middlewares/verifyAccessLevel.middleware";
import validateNumberIdMiddleware from "../middlewares/validateNumberId.middleware";
import validateBodyMiddleware from "../middlewares/validateBody.middleware";

import updateBillSchema from "../schemas/bills/updateBill.schema";

const billsRoutes = Router();

billsRoutes.post("/", verifyAccessLevelMiddleware(3), BillsController.store);
billsRoutes.get("/", verifyAccessLevelMiddleware(3), BillsController.index);

billsRoutes.use("/:id", validateNumberIdMiddleware);

billsRoutes.get("/:id", verifyAccessLevelMiddleware(3), BillsController.show);

billsRoutes.patch(
  "/:id",
  validateBodyMiddleware(updateBillSchema),
  verifyAccessLevelMiddleware(3),
  BillsController.update
);
billsRoutes.delete(
  "/:id",
  verifyAccessLevelMiddleware(2),
  BillsController.delete
);

export default billsRoutes;
