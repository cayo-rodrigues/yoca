import { Router } from "express";
import OrdersController from "../controllers/Orders.controller";

const ordersRoutes = Router();

ordersRoutes.post("", OrdersController.store);
ordersRoutes.get("", OrdersController.index);

export default ordersRoutes;
