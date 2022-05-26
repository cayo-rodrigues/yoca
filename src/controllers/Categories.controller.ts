import { Request, Response } from "express";
import { instanceToPlain } from "class-transformer";

import CreateCategoryService from "../services/Categories/CreateCategory.service";
import ListCategoriesService from "../services/Categories/ListCategories.service";
import ShowCategoryService from "../services/Categories/ShowCategory.service";
import UpdateCategoryService from "../services/Categories/UpdateCategory.service";
import DeleteCategoryService from "../services/Categories/DeleteCategory.service";
import {
  ICreateCategory,
  IUpdateCategoryData,
} from "../interfaces/Category.interface";

class CategoriesController {
  static async store(req: Request, res: Response) {
    const { name }: ICreateCategory = req.body;

    const category = await CreateCategoryService.execute({ name });

    res.status(201).json({
      message: "Category created",
      category: instanceToPlain(category),
    });
  }

  static async index(req: Request, res: Response) {
    const per_page = req.query.per_page as string;
    const page = req.query.page as string;

    const categories = await ListCategoriesService.execute({
      per_page: +per_page,
      page: +page,
    });

    res.json(instanceToPlain(categories));
  }

  static async show(req: Request, res: Response) {
    const { id } = req.params;

    const category = await ShowCategoryService.execute({ id });

    res.json(instanceToPlain(category));
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name }: IUpdateCategoryData = req.body;

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

    await DeleteCategoryService.execute({ id });

    res.status(204).json();
  }
}

export default CategoriesController;
