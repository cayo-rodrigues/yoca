import { Request, Response } from "express";
import CreateProductService from "../services/Products/createProduct.service";
import ListProductsService from "../services/Products/listProducts.service";

export default class ProductsController {
  static async store(req: Request, res: Response) {
    const { name, price, calories, ingredients, categories } = req.body;

    const product = await CreateProductService.execute({
      name,
      price,
      calories,
      ingredients,
      categories,
    });

    return res.status(201).json({ message: "Product created", product });
  }

  static async index(req: Request, res: Response) {
    const products = await ListProductsService.execute();

    return res.json(products);
  }

  static async show(req: Request, res: Response) {}

  static async update(req: Request, res: Response) {}

  static async delete(req: Request, res: Response) {}
}
