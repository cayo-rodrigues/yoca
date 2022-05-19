import { Router } from "express";
import IngredientController from "../controllers/Ingredient.controller";

const ingredientsRoutes = Router();

ingredientsRoutes.post("/", IngredientController.store);
ingredientsRoutes.get("/", IngredientController.index);
ingredientsRoutes.get("/:id", IngredientController.show);

export default ingredientsRoutes;
