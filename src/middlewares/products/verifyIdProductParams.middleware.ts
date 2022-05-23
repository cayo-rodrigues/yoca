import { NextFunction, Request, Response } from "express";
import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import Product from "../../models/Product.model";

const verifyIdProductParamsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const productsRepo = AppDataSource.getRepository(Product);

  if (await productsRepo.findOne({ where: { id } })) {
    return next();
  }

  throw new AppError("Product not found", 404);
};

export default verifyIdProductParamsMiddleware;
