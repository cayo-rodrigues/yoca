import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import { IUUID } from "../../interfaces/IdParam.interface";
import Ingredient from "../../models/Ingredient.model";

class DeleteIngredientService {
  static async execute({ id }: IUUID): Promise<void> {
    const ingredientRepo = AppDataSource.getRepository(Ingredient);

    const ingredientExists = await ingredientRepo.findOne({ where: { id } });

    if (!ingredientExists) {
      throw new AppError("Ingredient not found", 404);
    }

    await ingredientRepo.delete({ id });
  }
}

export default DeleteIngredientService;
