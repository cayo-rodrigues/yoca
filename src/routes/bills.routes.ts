import { Router } from "express";
import BillsController from "../controllers/Bills.controller";
import verifyAccessLevelMiddleware from "../middlewares/verifyAccessLevel.middleware";

const billsRoutes = Router();

billsRoutes.use(verifyAccessLevelMiddleware(3));

billsRoutes.post("/", BillsController.store);
billsRoutes.get("/", BillsController.index);
billsRoutes.get("/:id", BillsController.show);
billsRoutes.patch("/:id", BillsController.update);
billsRoutes.delete("/:id", BillsController.delete);

export default billsRoutes;
