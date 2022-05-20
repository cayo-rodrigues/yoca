import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";

import IngredientController from "../controllers/Ingredient.controller";
import normalizeIngredientMiddleware from "../middlewares/ingredients/normalizeIngredient.middleware";
import createIngredientSchema from "../schemas/ingredients/createIngredient.schema";
import updateIngredientSchema from "../schemas/ingredients/updateIngredient.schema";
import validateUUIDSchema from "../schemas/validateUUID.schema";

const ingredientsRoutes = Router();

ingredientsRoutes.post(
  "/",
  expressYupMiddleware({ schemaValidator: createIngredientSchema }),
  normalizeIngredientMiddleware,
  IngredientController.store
);
ingredientsRoutes.get("/", IngredientController.index);

ingredientsRoutes.use(
  "/:id",
  expressYupMiddleware({ schemaValidator: validateUUIDSchema })
);

ingredientsRoutes.get("/:id", IngredientController.show);
ingredientsRoutes.patch(
  "/:id",
  expressYupMiddleware({ schemaValidator: updateIngredientSchema }),
  IngredientController.update
);

export default ingredientsRoutes;
