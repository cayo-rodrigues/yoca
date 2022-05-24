import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";

import ProductsController from "../controllers/Products.controller";

import createProductSchema from "../schemas/products/createProduct.schema";
import updateProductSchema from "../schemas/products/updateProduct.schema";
import validateUUIDSchema from "../schemas/validateUUID.schema";

import verifyIdProductParamsMiddleware from "../middlewares/products/verifyIdProductParams.middleware";
import verifyProductInfosMiddleware from "../middlewares/products/verifyProductInfos.middleware";
import verifyAccessLevelMiddleware from "../middlewares/verifyAccessLevel.middleware";
import normalizeProductMiddleware from "../middlewares/products/normalizeProduct.middleware";
import normalizeProductToUpdateMiddleware from "../middlewares/products/normalizeProductToUpdate.middleware";
import verifyProductToUpdateInfosMiddleware from "../middlewares/products/verifyProductToUpdateInfos.middleware";

const productsRoutes = Router();

productsRoutes.post(
  "/",
  verifyAccessLevelMiddleware(2),
  expressYupMiddleware({ schemaValidator: createProductSchema }),
  normalizeProductMiddleware,
  verifyProductInfosMiddleware,
  ProductsController.store
);
productsRoutes.get("/", ProductsController.index);

productsRoutes.use(verifyIdProductParamsMiddleware);

productsRoutes.use(
  "/:id",
  expressYupMiddleware({ schemaValidator: validateUUIDSchema })
);

productsRoutes.get("/:id", ProductsController.show);
productsRoutes.patch(
  "/:id",
  verifyAccessLevelMiddleware(2),
  expressYupMiddleware({ schemaValidator: updateProductSchema }),
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
