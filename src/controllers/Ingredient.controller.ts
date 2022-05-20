import { Request, Response } from "express";

import { IBaseIngredient } from "../interfaces/Ingredient.interface";
import CreateIngredientService from "../services/Ingredients/CreateIngredient.service";
import ListIngredientsService from "../services/Ingredients/ListIngredients.service";
import ShowIngredientService from "../services/Ingredients/ShowIngredient.service";
import UpdateIngredientService from "../services/Ingredients/UpdateIngredient.service";

class IngredientController {
  static async store(req: Request, res: Response) {
    const ingredientInfo: IBaseIngredient = req.ingredientInfo;

    const ingredient = await CreateIngredientService.execute(ingredientInfo);

    return res.status(201).send({ message: "Ingredient created", ingredient });
  }

  static async index(req: Request, res: Response) {
    const ingredients = await ListIngredientsService.execute();

    return res.send(ingredients);
  }

  static async show(req: Request, res: Response) {
    const { id } = req.params;

    const ingredient = await ShowIngredientService.execute({ id });

    return res.send(ingredient);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const ingredientInfo: IBaseIngredient = req.body;

    const updatedIngredient = await UpdateIngredientService.execute({
      id,
      ...ingredientInfo,
    });

    return res.send({ message: "Ingredient updated", updatedIngredient });
  }

  static async delete(req: Request, res: Response) {}
}

export default IngredientController;
