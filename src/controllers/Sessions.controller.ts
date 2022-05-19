import { Request, Response } from "express";
import AppError from "../errors/AppError";
import AuthenticateService from "../services/Sessions/Authenticate.service";

export default class SessionsController {
  static async authenticate(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Missing email or password on body request", 400);
    }

    const token = await AuthenticateService.execute({ email, password });

    res.status(200).json({ token });
  }
}
