import { Request, Response } from "express";
import { instanceToPlain } from "class-transformer";

import CreateCategoryService from "../services/Categories/CreateCategory.service";
import ListAllCategoriesService from "../services/Categories/ListAllCategories.service";
import ListOneCategoryService from "../services/Categories/ListOneCategory.service";
import UpdateCategoryService from "../services/Categories/UpdateCategory.service";
import DeleteCategoryService from "../services/Categories/DeleteCategory.service";
import {
  CreateCategoryServiceParams,
  UpdateCategoryData,
} from "../interfaces/Category.interface";

class CategoriesController {
  static async store(req: Request, res: Response) {
    const { name }: CreateCategoryServiceParams = req.body;

    const category = await CreateCategoryService.execute({ name });

    res.status(201).json({
      message: "Category created",
      category: instanceToPlain(category),
    });
  }

  static async index(req: Request, res: Response) {
    const categories = await ListAllCategoriesService.execute();

    res.json(instanceToPlain(categories));
  }

  static async show(req: Request, res: Response) {
    const { id } = req.params;

    const category = await ListOneCategoryService.execute(id);

    res.json(instanceToPlain(category));
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name }: UpdateCategoryData = req.body;

    const category = await UpdateCategoryService.execute({
      id,
      updateData: { name },
    });

    res.json({
      message: "Category updated",
      category: instanceToPlain(category),
    });
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    await DeleteCategoryService.execute(id);

    res.status(204).json();
  }
}

export default CategoriesController;
