import AppDataSource from "../../data-source";
import Category from "../../models/Category.model";

class ListAllCategoriesService {
  static async execute(): Promise<Category[]> {
    const categoryRepository = AppDataSource.getRepository(Category)

    const categories = await categoryRepository.find()

    return categories
  }
}

export default ListAllCategoriesService