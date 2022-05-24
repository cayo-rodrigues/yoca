import { Router } from "express";

import ProductsController from "../controllers/Products.controller";
import verifyIdProductParamsMiddleware from "../middlewares/products/verifyIdProductParams.middleware";
import verifyAccessLevelMiddleware from "../middlewares/verifyAccessLevel.middleware";

const productsRoutes = Router();

productsRoutes.post(
  "/",
  verifyAccessLevelMiddleware(2),
  ProductsController.store
);
productsRoutes.get("/", ProductsController.index);

productsRoutes.use(verifyIdProductParamsMiddleware);

productsRoutes.get("/:id", ProductsController.show);
productsRoutes.patch(
  "/:id",
  verifyAccessLevelMiddleware(2),
  ProductsController.update
);
productsRoutes.delete(
  "/:id",
  verifyAccessLevelMiddleware(2),
  ProductsController.delete
);

export default productsRoutes;
