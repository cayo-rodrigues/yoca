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
    const { amount, amountMax, amountMin, measure, name }: IBaseIngredient =
      req.body;

    const ingredient = await CreateIngredientService.execute({
      amount,
      amountMax,
      amountMin,
      measure,
      name,
    });

    return res.status(201).send({
      message: "Ingredient created",
      ingredient: instanceToPlain(ingredient),
    });
  }

  static async index(req: Request, res: Response) {
    const per_page = req.query.per_page as string;
    const page = req.query.page as string;

    const ingredients = await ListIngredientsService.execute({
      per_page: +per_page,
      page: +page,
    });

    return res.json(instanceToPlain(ingredients));
  }

  static async show(req: Request, res: Response) {
    const { id } = req.params;

    const ingredient = await ShowIngredientService.execute({ id });

    return res.json(instanceToPlain(ingredient));
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { amount, amountMax, amountMin, measure, name }: IBaseIngredient =
      req.body;

    const updatedIngredient = await UpdateIngredientService.execute({
      id,
      amount,
      amountMax,
      amountMin,
      measure,
      name,
    });

    return res.json({
      message: "Ingredient updated",
      ingredient: instanceToPlain(updatedIngredient),
    });
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    await DeleteIngredientService.execute({ id });

    return res.status(204).json();
  }
}

export default IngredientController;
