import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import { IUUID } from "../../interfaces/IdParam.interface";
import Category from "../../models/Category.model";

class ShowCategoryService {
  static async execute({ id }: IUUID): Promise<Category> {
    const categoryRepository = AppDataSource.getRepository(Category);

    const category = await categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return category;
  }
}

export default ShowCategoryService;
