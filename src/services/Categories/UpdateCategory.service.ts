import { Not } from "typeorm";
import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import { IUpdateCategory } from "../../interfaces/Category.interface";
import Category from "../../models/Category.model";

class UpdateCategoryService {
  static async execute({ id, updateData }: IUpdateCategory): Promise<Category> {
    const categoryRepository = AppDataSource.getRepository(Category);

    const category = await categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    const categoryAlreadyExists = await categoryRepository.findOne({
      where: { name: updateData.name, id: Not(id) },
    });

    if (categoryAlreadyExists) {
      throw new AppError("Category with this name already exists", 409);
    }

    const updatedCategory = await categoryRepository.save({
      ...category,
      name: updateData.name,
    });

    return updatedCategory;
  }
}

export default UpdateCategoryService;
