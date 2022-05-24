import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";

import ProductsController from "../controllers/Products.controller";
import verifyIdProductParamsMiddleware from "../middlewares/products/verifyIdProductParams.middleware";

import verifyProductInfosMiddleware from "../middlewares/products/verifyProductInfos.middleware";
import createProductSchema from "../schemas/products/createProduct.schema";
import updateProductSchema from "../schemas/products/updateProduct.schema";

import verifyAccessLevelMiddleware from "../middlewares/verifyAccessLevel.middleware";
import validateUUIDSchema from "../schemas/validateUUID.schema";
import normalizeProductMiddleware from "../middlewares/products/normalizeProduct.middleware";

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
  ProductsController.update
);

productsRoutes.delete(
  "/:id",
  verifyAccessLevelMiddleware(2),
  ProductsController.delete
);

export default productsRoutes;
