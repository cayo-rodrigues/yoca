import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import jwt from "jsonwebtoken";
import AppDataSource from "../data-source";
import Employee from "../models/Employee.model";

interface IDecoded {
  id: string;
  exp: number;
}

const ensureAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new AppError("Missing authorization headers", 401);
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      throw new AppError("Missing authorization token", 401);
    }

    const decoded = jwt.verify(token, process.env.SECRET || "default");

    const { id } = decoded as IDecoded;

    const employeeRepository = AppDataSource.getRepository(Employee);

    const loggedInUser = await employeeRepository.findOne({
      where: { id },
    });

    if (!loggedInUser) {
      throw new AppError("Unauthorized", 401);
    }

    req.user = loggedInUser;

    next();
  } catch (err) {
    if (err instanceof AppError) {
      throw new AppError(err.message, 401);
    }
    throw new AppError("Unauthorized", 401);
  }
};

export default ensureAuthMiddleware;
