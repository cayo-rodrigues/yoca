import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";

import CategoriesController from "../controllers/Categories.controller";

import verifyAccessLevelMiddleware from "../middlewares/verifyAccessLevel.middleware";

import createCategorySchema from "../schemas/categories/createCategory.schema";
import updateCategorySchema from "../schemas/categories/updateCategory.schema";
import validateUUIDSchema from "../schemas/validateUUID.schema";

const categoriesRoutes = Router();

categoriesRoutes.get("/", CategoriesController.index);

categoriesRoutes.get(
  "/:id",
  expressYupMiddleware({ schemaValidator: validateUUIDSchema }),
  CategoriesController.show
);

categoriesRoutes.use(verifyAccessLevelMiddleware(2));

categoriesRoutes.post(
  "/",
  expressYupMiddleware({ schemaValidator: createCategorySchema }),
  CategoriesController.store
);

categoriesRoutes.use(
  "/:id",
  expressYupMiddleware({ schemaValidator: validateUUIDSchema })
);

categoriesRoutes.patch(
  "/:id",
  expressYupMiddleware({ schemaValidator: updateCategorySchema }),
  CategoriesController.update
);

categoriesRoutes.delete("/:id", CategoriesController.delete);

export default categoriesRoutes;
