import { Router } from "express";

import BillsController from "../controllers/Bills.controller";

import validateUUIDMiddleware from "../middlewares/validateUUID.middleware";
import verifyAccessLevelMiddleware from "../middlewares/verifyAccessLevel.middleware";

const billsRoutes = Router();

billsRoutes.post("/", verifyAccessLevelMiddleware(3), BillsController.store);
billsRoutes.get("/", verifyAccessLevelMiddleware(3), BillsController.index);

billsRoutes.use("/:id", validateUUIDMiddleware);

billsRoutes.get("/:id", verifyAccessLevelMiddleware(3), BillsController.show);
billsRoutes.patch(
  "/:id",
  verifyAccessLevelMiddleware(3),
  BillsController.update
);
billsRoutes.delete(
  "/:id",
  verifyAccessLevelMiddleware(2),
  BillsController.delete
);

export default billsRoutes;
