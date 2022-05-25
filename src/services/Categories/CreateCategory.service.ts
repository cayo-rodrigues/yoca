import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import { ICreateCategory } from "../../interfaces/Category.interface";
import Category from "../../models/Category.model";

class CreateCategoryService {
  static async execute({ name }: ICreateCategory): Promise<Category> {
    const categoryRepository = AppDataSource.getRepository(Category);

    const categoryAlreadyExists = await categoryRepository.findOne({
      where: { name },
    });

    if (categoryAlreadyExists) {
      throw new AppError("Category already exists", 409);
    }

    const category = categoryRepository.create({ name });

    await categoryRepository.save(category);

    return category;
  }
}

export default CreateCategoryService;
