import { NextFunction, Request, Response } from "express";
import { ICreateIngredient } from "../../interfaces/Ingredient.interface";
import { normalizeTextInput, roundToTwo } from "../../utils";

const normalizeIngredientMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, measure, amount, amountMax, amountMin }: ICreateIngredient =
    req.body;

  const normalizedIngredient = {
    name: normalizeTextInput(name),
    measure: normalizeTextInput(measure),
    amount: roundToTwo(amount),
    amountMax: roundToTwo(amountMax),
    amountMin: roundToTwo(amountMin),
  };

  req.ingredientInfo = normalizedIngredient;

  next();
};

export default normalizeIngredientMiddleware;
