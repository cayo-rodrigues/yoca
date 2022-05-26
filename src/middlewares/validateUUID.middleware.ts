import { NextFunction, Request, Response } from "express";
import * as yup from "yup";
import AppError from "../errors/AppError";

const UUIDSchema = yup
  .string()
  .uuid("ID parameter must be an UUID")
  .required("ID parameter is missing");

const validateUUIDMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    await UUIDSchema.validate(id);

    next();
  } catch (err) {
    if (err instanceof yup.ValidationError)
      throw new AppError(err.errors[0], 400);
  }
};

export default validateUUIDMiddleware;
