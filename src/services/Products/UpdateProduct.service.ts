import { In } from "typeorm";

import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import Product from "../../models/Product.model";
import ProductCategory from "../../models/ProductCategory.model";
import ProductIngredient from "../../models/ProductsIngredients.model";
import { IUpdateProduct } from "../../interfaces/Products.interface";

class UpdateProductService {
  static async execute({
    id,
    name,
    price,
    calories,
    ingredients,
    categories,
  }: IUpdateProduct): Promise<Product> {
    const productsRepo = AppDataSource.getRepository(Product);

    const product = await productsRepo.findOne({ where: { id } });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (ingredients?.length) {
      const productsIngredientsRepo =
        AppDataSource.getRepository(ProductIngredient);

      const productOldIngredients = await productsIngredientsRepo.findBy({
        id: In(product.ingredients.map(({ id }) => id)),
      });

      productOldIngredients.forEach(async ({ id }) => {
        await productsIngredientsRepo.delete({ id });
      });

      ingredients.forEach(async ({ id, amount }) => {
        const productIngredient = productsIngredientsRepo.create({
          ingredientId: id,
          productId: product.id,
          amount,
        });

        await productsIngredientsRepo.save(productIngredient);
      });
    }

    if (categories?.length) {
      const productsCategoriesRepo =
        AppDataSource.getRepository(ProductCategory);

      const productOldCategories = await productsCategoriesRepo.findBy({
        id: In(product.categories.map(({ id }) => id)),
      });

      productOldCategories.forEach(async ({ id }) => {
        await productsCategoriesRepo.delete({ id });
      });

      categories.forEach(async (categoryId) => {
        const productCategory = productsCategoriesRepo.create({
          productId: product.id,
          categoryId,
        });

        await productsCategoriesRepo.save(productCategory);
      });
    }

    product.name = name ? name : product.name;
    product.price = price ? price : product.price;
    product.calories = calories ? calories : product.calories;

    await productsRepo.update(product.id, {
      name: product.name,
      price: product.price,
      calories: product.calories,
    });

    return product;
  }
}

export default UpdateProductService;
