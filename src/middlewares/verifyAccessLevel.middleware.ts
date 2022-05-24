import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";

const verifyAccessLevelMiddleware =
  (accessLevels: number | number[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    if (
      (Array.isArray(accessLevels) &&
        accessLevels.includes(loggedInUser.accessLevel)) ||
      loggedInUser.accessLevel <= accessLevels
    ) {
      next();
    }

    throw new AppError("You don't have permission to access this route", 401);
  };

export default verifyAccessLevelMiddleware;
