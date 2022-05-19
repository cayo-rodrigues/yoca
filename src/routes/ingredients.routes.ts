import { Router } from "express";
import IngredientController from "../controllers/Ingredient.controller";

const ingredientsRoutes = Router();

ingredientsRoutes.post("/", IngredientController.store);

export default ingredientsRoutes;
