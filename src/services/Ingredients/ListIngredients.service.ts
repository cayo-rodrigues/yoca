import AppDataSource from "../../data-source";
import Ingredient from "../../models/Ingredient.model";

class ListIngredientsService {
  static async execute(): Promise<Ingredient[]> {
    const ingredientRepo = AppDataSource.getRepository(Ingredient);

    const ingredients = await ingredientRepo.find();

    return ingredients;
  }
}

export default ListIngredientsService;
