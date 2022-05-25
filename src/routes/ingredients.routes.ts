import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";

import IngredientController from "../controllers/Ingredient.controller";

import normalizeIngredientMiddleware from "../middlewares/ingredients/normalizeIngredient.middleware";
import validateBodyMiddleware from "../middlewares/validateBody.middleware";
import validateUUIDMiddleware from "../middlewares/validateUUID.middleware";
import verifyAccessLevelMiddleware from "../middlewares/verifyAccessLevel.middleware";

import createIngredientSchema from "../schemas/ingredients/createIngredient.schema";
import updateIngredientSchema from "../schemas/ingredients/updateIngredient.schema";

const ingredientsRoutes = Router();

ingredientsRoutes.use(verifyAccessLevelMiddleware(2));

ingredientsRoutes.post(
  "/",
  validateBodyMiddleware(createIngredientSchema),
  normalizeIngredientMiddleware,
  IngredientController.store
);

ingredientsRoutes.get("/", IngredientController.index);

ingredientsRoutes.use("/:id", validateUUIDMiddleware);

ingredientsRoutes.get("/:id", IngredientController.show);

ingredientsRoutes.patch(
  "/:id",
  validateBodyMiddleware(updateIngredientSchema),
  IngredientController.update
);

ingredientsRoutes.delete("/:id", IngredientController.delete);

export default ingredientsRoutes;
