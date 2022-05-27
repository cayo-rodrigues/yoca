import { NextFunction, Request, Response } from "express";
import * as yup from "yup";
import AppError from "../errors/AppError";
import { MAX_INT } from "../utils";

const numberSchema = yup
  .number()
  .max(MAX_INT, `Id cannot be longer than ${MAX_INT}`)
  .positive("ID must be a positive number")
  .required("ID parameter is missing");

const validateNumberIdMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    await numberSchema.validate(id);

    next();
  } catch (err) {
    if (err instanceof yup.ValidationError)
      throw new AppError(err.errors[0], 400);
  }
};

export default validateNumberIdMiddleware;
