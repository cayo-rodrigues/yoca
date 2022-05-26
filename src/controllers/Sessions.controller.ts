import { Request, Response } from "express";

import { IAuthenticate } from "../interfaces/Session.interface";
import AuthenticateService from "../services/Sessions/Authenticate.service";

class SessionsController {
  static async authenticate(req: Request, res: Response) {
    const { email, password }: IAuthenticate = req.body;

    const token = await AuthenticateService.execute({ email, password });

    res.json({ token });
  }
}

export default SessionsController;
