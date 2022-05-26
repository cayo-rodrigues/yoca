import { Request, Response } from "express";
import { instanceToPlain } from "class-transformer";

import CreateProductService from "../services/Products/CreateProduct.service";
import ListProductsService from "../services/Products/ListProducts.service";
import ListOneProductService from "../services/Products/ShowProduct.service";
import DeleteProductService from "../services/Products/DeleteProduct.service";
import UpdateProductService from "../services/Products/UpdateProduct.service";

class ProductsController {
  static async store(req: Request, res: Response) {
    const { name, price, calories, ingredients, categories } = req.body;

    const product = await CreateProductService.execute({
      name,
      price,
      calories,
      ingredients,
      categories,
    });

    return res
      .status(201)
      .json({ message: "Product created", product: instanceToPlain(product) });
  }

  static async index(req: Request, res: Response) {
    const per_page = req.query.per_page as string;
    const page = req.query.page as string;

    const products = await ListProductsService.execute({
      per_page: +per_page,
      page: +page,
    });

    return res.json(instanceToPlain(products));
  }

  static async show(req: Request, res: Response) {
    const { id } = req.params;

    const product = await ListOneProductService.execute({ id });

    return res.json(instanceToPlain(product));
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, price, calories, ingredients, categories } = req.body;

    const productUpdated = await UpdateProductService.execute({
      id,
      name,
      price,
      calories,
      ingredients,
      categories,
    });

    return res.json({
      message: "Product updated",
      product: instanceToPlain(productUpdated),
    });
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    await DeleteProductService.execute({ id });

    return res.status(204).json();
  }
}

export default ProductsController;
