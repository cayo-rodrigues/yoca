import { NextFunction, Request, Response } from "express";
import AppError from "./AppError";
import "express-async-errors";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  console.log(err);

  return res.status(500).json({
    message: "Internal server error, please try again later",
  });
};

export default errorHandler;
