import AppDataSource from "../../data-source";
import { IList } from "../../interfaces/List.interface";
import Category from "../../models/Category.model";

class ListCategoriesService {
  static async execute({ per_page, page }: IList): Promise<Category[]> {
    const categoryRepository = AppDataSource.getRepository(Category);
    if (!per_page) {
      per_page = 20;
    }

    if (!page) {
      page = 1;
    }

    return await categoryRepository.find({
      skip: per_page * (page - 1),
      take: per_page,
    });
  }
}

export default ListCategoriesService;
