import { NextFunction, Request, Response } from "express";
import * as yup from "yup";
import AppError from "../errors/AppError";

const validateBodyMiddleware =
  (schema: yup.AnyObjectSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (Object.keys(req.body).length === 0) {
      throw new AppError("Empty request are not allowed", 400);
    }

    try {
      const data = req.body;

      const validatedData = await schema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
      });

      req.body = validatedData;

      next();
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const formattedMessage =
          err.errors.length > 1 ? err.errors : err.errors[0];

        throw new AppError(formattedMessage, 400);
      }
    }
  };

export default validateBodyMiddleware;
