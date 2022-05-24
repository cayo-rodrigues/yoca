import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";
import OrdersController from "../controllers/Orders.controller";
import createOrderSchema from "../schemas/orders/createOrder.schema";

const ordersRoutes = Router();

ordersRoutes.post(
  "",
  expressYupMiddleware({ schemaValidator: createOrderSchema }),
  OrdersController.store
);
ordersRoutes.get("", OrdersController.index);
ordersRoutes.patch("/:id", OrdersController.update);

export default ordersRoutes;
