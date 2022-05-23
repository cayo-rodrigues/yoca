import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";

import ProductsController from "../controllers/Products.controller";
import verifyIdProductParamsMiddleware from "../middlewares/products/verifyIdProductParams.middleware";
import verifyProductInfosAndNormalize from "../middlewares/products/verifyProductInfosAndNormalize.middleware";
import createProductSchema from "../schemas/products/createProduct.schema";
import updateProductSchema from "../schemas/products/updateProduct.schema";

const productsRoutes = Router();

productsRoutes.post(
  "/",
  expressYupMiddleware({ schemaValidator: createProductSchema }),
  verifyProductInfosAndNormalize,
  ProductsController.store
);
productsRoutes.get("/", ProductsController.index);

productsRoutes.use(verifyIdProductParamsMiddleware);

productsRoutes.get("/:id", ProductsController.show);
productsRoutes.patch(
  "/:id",
  expressYupMiddleware({ schemaValidator: updateProductSchema }),
  ProductsController.update
);
productsRoutes.delete("/:id", ProductsController.delete);

export default productsRoutes;
