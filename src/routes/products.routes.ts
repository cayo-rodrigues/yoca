import { Router } from "express";

import ProductsController from "../controllers/Products.controller";

import verifyIdProductParamsMiddleware from "../middlewares/products/verifyIdProductParams.middleware";
import verifyProductInfosMiddleware from "../middlewares/products/verifyProductInfos.middleware";
import verifyAccessLevelMiddleware from "../middlewares/verifyAccessLevel.middleware";
import normalizeProductMiddleware from "../middlewares/products/normalizeProduct.middleware";
import normalizeProductToUpdateMiddleware from "../middlewares/products/normalizeProductToUpdate.middleware";
import verifyProductToUpdateInfosMiddleware from "../middlewares/products/verifyProductToUpdateInfos.middleware";

import createProductSchema from "../schemas/products/createProduct.schema";
import updateProductSchema from "../schemas/products/updateProduct.schema";
import validateUUIDMiddleware from "../middlewares/validateUUID.middleware";
import validateBodyMiddleware from "../middlewares/validateBody.middleware";

const productsRoutes = Router();

productsRoutes.get("/", ProductsController.index);

productsRoutes.get("/:id", validateUUIDMiddleware, ProductsController.show);

productsRoutes.use(verifyAccessLevelMiddleware(2));

productsRoutes.post(
  "/",
  validateBodyMiddleware(createProductSchema),
  normalizeProductMiddleware,
  verifyProductInfosMiddleware,
  ProductsController.store
);

productsRoutes.use(verifyIdProductParamsMiddleware);

productsRoutes.use("/:id", validateUUIDMiddleware);

productsRoutes.patch(
  "/:id",
  validateBodyMiddleware(updateProductSchema),
  normalizeProductToUpdateMiddleware,
  verifyProductToUpdateInfosMiddleware,
  ProductsController.update
);

productsRoutes.delete(
  "/:id",
  verifyAccessLevelMiddleware(2),
  ProductsController.delete
);

export default productsRoutes;
