import { Router } from "express";

import CategoriesController from "../controllers/Categories.controller";

import validateBodyMiddleware from "../middlewares/validateBody.middleware";
import validateUUIDMiddleware from "../middlewares/validateUUID.middleware";
import verifyAccessLevelMiddleware from "../middlewares/verifyAccessLevel.middleware";

import createCategorySchema from "../schemas/categories/createCategory.schema";
import updateCategorySchema from "../schemas/categories/updateCategory.schema";

const categoriesRoutes = Router();

categoriesRoutes.get("/", CategoriesController.index);

categoriesRoutes.get("/:id", validateUUIDMiddleware, CategoriesController.show);

categoriesRoutes.use(verifyAccessLevelMiddleware(2));

categoriesRoutes.post(
  "/",
  validateBodyMiddleware(createCategorySchema),
  CategoriesController.store
);

categoriesRoutes.use("/:id", validateUUIDMiddleware);

categoriesRoutes.patch(
  "/:id",
  validateBodyMiddleware(updateCategorySchema),
  CategoriesController.update
);

categoriesRoutes.delete("/:id", CategoriesController.delete);

export default categoriesRoutes;
