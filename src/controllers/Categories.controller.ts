import { Request, Response } from "express";

import CreateCategoryService from "../services/Categories/CreateCategory.service";
import ListAllCategoriesService from "../services/Categories/ListAllCategories.service";
import ListOneCategoryService from "../services/Categories/ListOneCategory.service";
import UpdateCategoryService from "../services/Categories/UpdateCategory.service";
import DeleteCategoryService from "../services/Categories/DeleteCategory.service";
import { instanceToPlain } from "class-transformer";

export default class CategoriesController {
  static async store(req: Request, res: Response) {
    const data = req.body;

    const category = await CreateCategoryService.execute(data);

    res.status(201).json({
      message: "Category created",
      category: instanceToPlain(category),
    });
  }

  static async index(req: Request, res: Response) {
    const categories = await ListAllCategoriesService.execute();

    res.status(200).json(instanceToPlain(categories));
  }

  static async show(req: Request, res: Response) {
    const { id } = req.params;

    const category = await ListOneCategoryService.execute(id);

    res.status(200).json(instanceToPlain(category));
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const updateData = req.body;

    const category = await UpdateCategoryService.execute({ id, updateData });

    res.status(200).json({
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
