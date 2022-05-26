import { NextFunction, Request, Response } from "express";
import { In, Not } from "typeorm";

import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import { IUpdateProduct } from "../../interfaces/Products.interface";
import Category from "../../models/Category.model";
import Ingredient from "../../models/Ingredient.model";
import Product from "../../models/Product.model";

const verifyProductToUpdateInfosMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productsRepo = AppDataSource.getRepository(Product);
  const ingredientsRepo = AppDataSource.getRepository(Ingredient);
  const categoriesRepo = AppDataSource.getRepository(Category);

  const { id } = req.params;
  const { name, ingredients, categories }: IUpdateProduct = req.body;

  const nameUnavailable = await productsRepo.findOne({
    where: {
      name,
      id: Not(id),
    },
  });

  if (nameUnavailable) {
    throw new AppError("Product name already in use", 409);
  }

  if (ingredients?.length) {
    const allIngredients = await ingredientsRepo.findBy({
      id: In(ingredients.map(({ id }) => id)),
    });

    if (allIngredients.length !== ingredients.length) {
      throw new AppError("Invalid list of ingredients ids", 400);
    }
  }

  if (categories?.length) {
    const allCategories = await categoriesRepo.findBy({
      id: In(categories),
    });

    if (allCategories.length !== categories.length) {
      throw new AppError("Invalid list of categories ids", 400);
    }
  }

  return next();
};

export default verifyProductToUpdateInfosMiddleware;
