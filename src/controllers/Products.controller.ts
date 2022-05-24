import { Request, Response } from "express";
import CreateProductService from "../services/Products/createProduct.service";
import ListProductsService from "../services/Products/listProducts.service";
import ListOneProductService from "../services/Products/listOneProduct.service";
import DeleteProductService from "../services/Products/deleteProduct.service";
import UpdateProductService from "../services/Products/updateProduct.service";
import { instanceToPlain } from "class-transformer";

export default class ProductsController {
  static async store(req: Request, res: Response) {
    const { name, price, calories, ingredients, categories } = req.productInfo;

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
    const products = await ListProductsService.execute();

    return res.json(instanceToPlain(products));
  }

  static async show(req: Request, res: Response) {
    const { id } = req.params;

    const product = await ListOneProductService.execute({ id });

    return res.json(instanceToPlain(product));
  }

  static async update(req: Request, res: Response) {
    const { id, name, price, calories, ingredients, categories } =
      req.updateProductInfos;

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
