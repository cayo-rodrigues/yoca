import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import Ingredient from "../../models/Ingredient.model";

interface DeleteIngredientServiceParams {
  id: string;
}

class DeleteIngredientService {
  static async execute({ id }: DeleteIngredientServiceParams): Promise<any> {
    const ingredientRepo = AppDataSource.getRepository(Ingredient);

    const ingredientExists = await ingredientRepo.findOne({ where: { id } });

    if (!ingredientExists) {
      throw new AppError("Ingredient not found", 404);
    }

    await ingredientRepo.delete({ id });
  }
}

export default DeleteIngredientService;
