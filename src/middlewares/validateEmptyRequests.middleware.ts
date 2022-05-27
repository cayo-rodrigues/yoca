import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";

const validateEmptyRequestsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (Object.keys(req.body).length === 0) {
    throw new AppError("Empty request are not allowed", 400);
  }

  next();
};

export default validateEmptyRequestsMiddleware;
