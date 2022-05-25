import AppDataSource from "../../data-source";
import { IList } from "../../interfaces/List.interface";
import Ingredient from "../../models/Ingredient.model";

class ListIngredientsService {
  static async execute({ per_page, page }: IList): Promise<any> {
    const ingredientRepo = AppDataSource.getRepository(Ingredient);

    if (!per_page) {
      per_page = 20;
    }

    if (!page) {
      page = 1;
    }

    const count = await ingredientRepo.count();

    const pages = Math.ceil(count / per_page);

    const prev =
      page <= 1
        ? null
        : `urlDoHeroku/bills?per_page=${per_page}&page=${page - 1}`;

    const next =
      page >= pages
        ? null
        : `urlDoHeroku/bills?per_page=${per_page}&page=${page + 1}`;

    const ingredients = await ingredientRepo.find({
      skip: per_page * (page - 1),
      take: per_page,
    });

    return {
      ingredients,
      info: {
        count,
        pages,
        next,
        prev,
      },
    };
  }
}

export default ListIngredientsService;
