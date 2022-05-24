import { instanceToPlain } from "class-transformer";
import { Request, Response } from "express";
import CreateSuperService from "../services/Super/CreateSuper.service";

export default class Controller {
  static async store(req: Request, res: Response) {
    const data = req.body;

    const superUser = await CreateSuperService.execute(data);

    res.status(201).json({
      message: "Super user created",
      superUser: instanceToPlain(superUser),
    });
  }
}
