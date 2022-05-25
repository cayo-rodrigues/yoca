import AppDataSource from "../../data-source";
import { IList } from "../../interfaces/List.interface";
import Ingredient from "../../models/Ingredient.model";

class ListIngredientsService {
  static async execute({ per_page, page }: IList): Promise<Ingredient[]> {
    const ingredientRepo = AppDataSource.getRepository(Ingredient);

    if (!per_page) {
      per_page = 20;
    }

    if (!page) {
      page = 1;
    }

    return await ingredientRepo.find({
      skip: per_page * (page - 1),
      take: per_page,
    });
  }
}

export default ListIngredientsService;
