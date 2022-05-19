import { Router } from "express";
import BillsController from "../controllers/Bills.controller";

const billsRoutes = Router();

billsRoutes.post("/", BillsController.store);
billsRoutes.get("/", BillsController.index);
billsRoutes.patch("/", BillsController.update);
billsRoutes.delete("/", BillsController.delete);

export default billsRoutes;