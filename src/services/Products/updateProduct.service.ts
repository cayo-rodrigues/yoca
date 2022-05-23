import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import { IUpdateProduct } from "../../interfaces/Products.interface";
import Product from "../../models/Product.model";
import ProductCategory from "../../models/ProductCategory.model";
import ProductIngredient from "../../models/ProductsIngredients.model";

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

    if (ingredients.length) {
      const productsIngredientsRepo =
        AppDataSource.getRepository(ProductIngredient);

      const productIngredients = await productsIngredientsRepo.find();

      const lengthProductIngredients = productIngredients.filter(
        (el) => el.productId === product.id
      ).length;

      ingredients.forEach(async (ingredient, index) => {
        if (index <= lengthProductIngredients) {
          await productsIngredientsRepo.update(product.id, {
            ingredientId: ingredient.id,
            amount: ingredient.amount,
          });
        } else {
          const productIngredient = productsIngredientsRepo.create({
            ingredientId: ingredient.id,
            productId: product.id,
            amount: ingredient.amount,
          });

          await productsIngredientsRepo.save(productIngredient);
        }
      });
    }

    if (categories.length) {
      const productsCategoriesRepo =
        AppDataSource.getRepository(ProductCategory);

      const productCategories = await productsCategoriesRepo.find();

      const lengthProductCategories = productCategories.filter(
        (el) => el.productId === product.id
      ).length;

      categories.forEach(async (categoryId, index) => {
        if (index <= lengthProductCategories) {
          await productsCategoriesRepo.update(product.id, {
            categoryId,
          });
        } else {
          const productCategory = productsCategoriesRepo.create({
            productId: product.id,
            categoryId,
          });

          await productsCategoriesRepo.save(productCategory);
        }
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
