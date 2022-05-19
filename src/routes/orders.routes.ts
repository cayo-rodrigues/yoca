import { Router } from "express";
import OrdersController from "../controllers/Orders.controller";

const ordersRoutes = Router();

ordersRoutes.post("/", OrdersController.store);
ordersRoutes.get("/", OrdersController.index);
ordersRoutes.get("/orders/me", OrdersController.userOrders);
ordersRoutes.get("/orders/cook", OrdersController.pendingOrders);
ordersRoutes.get("/orders/ready", OrdersController.readyOrders);

export default ordersRoutes;
