import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";
import OrdersController from "../controllers/Orders.controller";
import verifyAccessLevelMiddleware from "../middlewares/verifyAccessLevel.middleware";
import createOrderSchema from "../schemas/orders/createOrder.schema";

const ordersRoutes = Router();

ordersRoutes.post(
  "",
  verifyAccessLevelMiddleware(4),
  expressYupMiddleware({ schemaValidator: createOrderSchema }),
  OrdersController.store
);
ordersRoutes.get("", verifyAccessLevelMiddleware(4), OrdersController.index);
ordersRoutes.patch("/:id", OrdersController.update);
ordersRoutes.delete(
  "/:id",
  verifyAccessLevelMiddleware(4),
  OrdersController.delete
);

export default ordersRoutes;
