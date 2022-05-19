import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";

import IngredientController from "../controllers/Ingredient.controller";
import createIngredientSchema from "../schemas/ingredients/createIngredient.schema";
import validateUUIDSchema from "../schemas/validateUUID.schema";

const ingredientsRoutes = Router();

ingredientsRoutes.post(
  "/",
  expressYupMiddleware({ schemaValidator: createIngredientSchema }),
  IngredientController.store
);
ingredientsRoutes.get("/", IngredientController.index);
ingredientsRoutes.get(
  "/:id",
  expressYupMiddleware({ schemaValidator: validateUUIDSchema }),
  IngredientController.show
);

export default ingredientsRoutes;
