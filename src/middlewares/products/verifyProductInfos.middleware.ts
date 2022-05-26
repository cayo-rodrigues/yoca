import { NextFunction, Request, Response } from "express";
import { In } from "typeorm";
import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import { ICreateProduct } from "../../interfaces/Products.interface";
import Category from "../../models/Category.model";
import Ingredient from "../../models/Ingredient.model";
import Product from "../../models/Product.model";

const verifyProductInfosMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productsRepo = AppDataSource.getRepository(Product);
  const ingredientsRepo = AppDataSource.getRepository(Ingredient);
  const categoriesRepo = AppDataSource.getRepository(Category);

  const { name, ingredients, categories }: ICreateProduct = req.body;

  const productAlreadyExists = await productsRepo.findOne({
    where: { name },
  });

  if (productAlreadyExists) {
    throw new AppError("Product with this name already exists", 409);
  }

  const allIngredients = await ingredientsRepo.findBy({
    id: In(ingredients.map(({ id }) => id)),
  });

  if (allIngredients.length !== ingredients.length) {
    throw new AppError("Invalid list of ingredients ids", 400);
  }

  const allCategories = await categoriesRepo.findBy({
    id: In(categories),
  });

  if (allCategories.length !== categories.length) {
    throw new AppError("Invalid list of categories ids", 400);
  }

  return next();
};

export default verifyProductInfosMiddleware;
