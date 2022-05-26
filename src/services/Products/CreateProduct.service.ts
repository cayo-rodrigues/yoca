import AppDataSource from "../../data-source";
import Product from "../../models/Product.model";
import ProductCategory from "../../models/ProductCategory.model";
import ProductIngredient from "../../models/ProductsIngredients.model";
import { ICreateProduct } from "../../interfaces/Products.interface";

class CreateProductService {
  static async execute({
    name,
    price,
    calories,
    ingredients,
    categories,
  }: ICreateProduct): Promise<Product> {
    const productsRepo = AppDataSource.getRepository(Product);

    const productsIngredientsRepo =
      AppDataSource.getRepository(ProductIngredient);

    const productsCategoriesRepo = AppDataSource.getRepository(ProductCategory);

    const product = productsRepo.create({ name, price, calories });

    await productsRepo.save(product);

    ingredients.forEach(async (ingredient) => {
      const productIngredient = productsIngredientsRepo.create({
        ingredientId: ingredient.id,
        productId: product.id,
        amount: ingredient.amount,
      });

      await productsIngredientsRepo.save(productIngredient);
    });

    categories.forEach(async (categoryId) => {
      const productCategory = productsCategoriesRepo.create({
        productId: product.id,
        categoryId,
      });

      await productsCategoriesRepo.save(productCategory);
    });

    return product;
  }
}

export default CreateProductService;
