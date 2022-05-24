import { Request, Response, NextFunction } from "express";

import { IUpdateProduct } from "../../interfaces/Products.interface";
import { normalizeTextInput, roundToTwo } from "../../utils";

const normalizeProductToUpdateMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, price, calories, ingredients, categories } = req.body;

  const normalizedProduct: IUpdateProduct = {
    id,
    name: name && normalizeTextInput(name),
    price: price && roundToTwo(price),
    calories: calories && roundToTwo(calories),
    ingredients,
    categories,
  };

  req.updateProductInfos = normalizedProduct;

  return next();
};

export default normalizeProductToUpdateMiddleware;
