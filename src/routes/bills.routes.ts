import { Router } from "express";
import BillsController from "../controllers/Bills.controller";

const billsRoutes = Router();

billsRoutes.post("/", BillsController.store);
billsRoutes.get("/", BillsController.index);
billsRoutes.patch("/:id", BillsController.update);
billsRoutes.delete("/:id", BillsController.delete);

export default billsRoutes;