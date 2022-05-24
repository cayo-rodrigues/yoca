import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";

const verifyAccessLevelMiddleware =
  (accessLevel: number) =>
  (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    if (loggedInUser.accessLevel > accessLevel) {
      throw new AppError("You don't have permission to access this route", 401);
    }

    next();
  };

export default verifyAccessLevelMiddleware;
