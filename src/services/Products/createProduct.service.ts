import AppDataSource from "../../data-source";
import { ICreateProduct } from "../../interfaces/Products.interface";
import Product from "../../models/Product.model";

class CreateProductService {
  static async execute({
    name,
    price,
    calories,
    ingredients,
    categories,
  }: ICreateProduct): Promise<Product> {
    const productsRepo = AppDataSource.getRepository(Product);

    const product = productsRepo.create({
      name,
      price,
      calories,
      productIngredients: ingredients,
      categories,
    });

    await productsRepo.save(product);

    return product;
  }
}

export default CreateProductService;
