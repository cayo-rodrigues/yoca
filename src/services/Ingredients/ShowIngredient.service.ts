import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import { IUUID } from "../../interfaces/IdParam.interface";
import Ingredient from "../../models/Ingredient.model";

class ShowIngredientService {
  static async execute({ id }: IUUID): Promise<Ingredient> {
    const ingredientRepo = AppDataSource.getRepository(Ingredient);

    const ingredient = await ingredientRepo.findOne({ where: { id } });

    if (!ingredient) {
      throw new AppError("Ingredient not found", 404);
    }

    return ingredient;
  }
}

export default ShowIngredientService;
