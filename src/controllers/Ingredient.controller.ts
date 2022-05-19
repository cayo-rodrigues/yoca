import { Request, Response } from "express";

import { ICreateIngredient } from "../interfaces/Ingredient.interface";
import CreateIngredientService from "../services/Ingredients/CreateIngredient.service";

class IngredientController {
  static async store(req: Request, res: Response) {
    const ingredientInfo: ICreateIngredient = req.body;

    const ingredient = await CreateIngredientService.execute(ingredientInfo);

    return res.status(201).send(ingredient);
  }

  static async index(req: Request, res: Response) {}

  static async show(req: Request, res: Response) {}

  static async update(req: Request, res: Response) {}

  static async delete(req: Request, res: Response) {}
}

export default IngredientController;
