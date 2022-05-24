import { Request, Response, NextFunction } from "express";

import { ICreateProduct } from "../../interfaces/Products.interface";
import { normalizeTextInput, roundToTwo } from "../../utils";

const normalizeProductMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, price, calories, ingredients, categories }: ICreateProduct =
    req.body;

  const normalizedProduct = {
    name: normalizeTextInput(name),
    price: roundToTwo(price),
    calories: roundToTwo(calories),
    ingredients,
    categories,
  };

  req.productInfo = normalizedProduct;

  return next();
};

export default normalizeProductMiddleware;
