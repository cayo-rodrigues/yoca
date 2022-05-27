import { Router } from "express";

import OrdersController from "../controllers/Orders.controller";

import validateBodyMiddleware from "../middlewares/validateBody.middleware";
import verifyAccessLevelMiddleware from "../middlewares/verifyAccessLevel.middleware";
import validateUUIDMiddleware from "../middlewares/validateUUID.middleware";

import createOrderSchema from "../schemas/orders/createOrder.schema";
import updateOrderSchema from "../schemas/orders/updateOrder.schema";

const ordersRoutes = Router();

ordersRoutes.post(
  "",
  verifyAccessLevelMiddleware(4),
  validateBodyMiddleware(createOrderSchema),
  OrdersController.store
);

ordersRoutes.get("/me", verifyAccessLevelMiddleware(4), OrdersController.my);

ordersRoutes.get(
  "/pending",
  verifyAccessLevelMiddleware(4),
  OrdersController.pending
);

ordersRoutes.get(
  "/ready",
  verifyAccessLevelMiddleware(4),
  OrdersController.ready
);

ordersRoutes.get("", verifyAccessLevelMiddleware(4), OrdersController.index);

ordersRoutes.get(
  "/:id",
  validateUUIDMiddleware,
  verifyAccessLevelMiddleware(4),
  OrdersController.show
);

ordersRoutes.patch(
  "/:id",
  validateUUIDMiddleware,
  validateBodyMiddleware(updateOrderSchema),
  OrdersController.update
);
ordersRoutes.delete(
  "/:id",
  validateUUIDMiddleware,
  verifyAccessLevelMiddleware(4),
  OrdersController.delete
);

export default ordersRoutes;
