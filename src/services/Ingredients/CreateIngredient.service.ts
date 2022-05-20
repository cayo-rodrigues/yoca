import AppDataSource from "../../data-source";
import Ingredient from "../../models/Ingredient.model";
import { ICreateIngredient } from "../../interfaces/Ingredient.interface";
import AppError from "../../errors/AppError";

class CreateIngredientService {
  static async execute(ingredientInfo: ICreateIngredient): Promise<Ingredient> {
    const ingredientRepo = AppDataSource.getRepository(Ingredient);

    const existingIngredient = await ingredientRepo.findOne({
      where: { name: ingredientInfo.name },
    });

    if (existingIngredient) {
      throw new AppError(
        "Ingredient already exists, add to its amount instead",
        409
      );
    }

    const ingredient = ingredientRepo.create(ingredientInfo);

    await ingredientRepo.save(ingredient);

    return ingredient;
  }
}

export default CreateIngredientService;
