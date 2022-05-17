import { NextFunction, Request, Response } from "express";
import AppError from "./AppError";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).send({
      status: err.statusCode,
      message: err.message,
    });
  }

  console.log(err);

  return res.status(500).send({
    status: 500,
    message: "Internal server error, please try again later",
  });
};

export default errorHandler;
