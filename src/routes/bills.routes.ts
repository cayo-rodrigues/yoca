import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";
import BillsController from "../controllers/Bills.controller";
import verifyAccessLevelMiddleware from "../middlewares/verifyAccessLevel.middleware";
import validateUUIDSchema from "../schemas/validateUUID.schema";

const billsRoutes = Router();

billsRoutes.use(verifyAccessLevelMiddleware(3));

billsRoutes.post("/", BillsController.store);
billsRoutes.get("/", BillsController.index);

billsRoutes.use(
  "/:id",
  expressYupMiddleware({ schemaValidator: validateUUIDSchema })
);

billsRoutes.get("/:id", BillsController.show);
billsRoutes.patch("/:id", BillsController.update);
billsRoutes.delete("/:id", BillsController.delete);

export default billsRoutes;
