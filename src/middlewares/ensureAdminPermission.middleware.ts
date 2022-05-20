import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";

const ensureAdminPermissionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loggedInUser = req.user;

  if (loggedInUser.accessLevel > 2) {
    throw new AppError("You need to be an admin to access this route", 401);
  }

  next();
};

export default ensureAdminPermissionMiddleware;
