import { instanceToPlain } from "class-transformer";
import { Request, Response } from "express";

import { IBaseIngredient } from "../interfaces/Ingredient.interface";
import CreateIngredientService from "../services/Ingredients/CreateIngredient.service";
import DeleteIngredientService from "../services/Ingredients/DeleteIngredient.service";
import ListIngredientsService from "../services/Ingredients/ListIngredients.service";
import ShowIngredientService from "../services/Ingredients/ShowIngredient.service";
import UpdateIngredientService from "../services/Ingredients/UpdateIngredient.service";

class IngredientController {
  static async store(req: Request, res: Response) {
    const ingredientInfo: IBaseIngredient = req.ingredientInfo;

    const ingredient = await CreateIngredientService.execute(ingredientInfo);

    return res.status(201).send({
      message: "Ingredient created",
      ingredient: instanceToPlain(ingredient),
    });
  }

  static async index(req: Request, res: Response) {
    const ingredients = await ListIngredientsService.execute();

    return res.send(instanceToPlain(ingredients));
  }

  static async show(req: Request, res: Response) {
    const { id } = req.params;

    const ingredient = await ShowIngredientService.execute({ id });

    return res.send(instanceToPlain(ingredient));
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const ingredientInfo: IBaseIngredient = req.body;

    const updatedIngredient = await UpdateIngredientService.execute({
      id,
      ...ingredientInfo,
    });

    return res.send({
      message: "Ingredient updated",
      updatedIngredient: instanceToPlain(updatedIngredient),
    });
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    await DeleteIngredientService.execute({ id });

    return res.status(204).send();
  }
}

export default IngredientController;
