import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import Category from "../../models/Category.model";

class DeleteCategoryService {
  static async execute(id: string): Promise<void> {
    const categoryRepository = AppDataSource.getRepository(Category);

    const category = await categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    await categoryRepository.delete(id);
  }
}

export default DeleteCategoryService;
