import { instanceToPlain } from "class-transformer";
import { Request, Response } from "express";

import { ICreateSuper } from "../interfaces/Super.interface";
import CreateSuperService from "../services/Super/CreateSuper.service";

class SuperController {
  static async store(req: Request, res: Response) {
    const { email, name, password, phone }: ICreateSuper = req.body;

    const superUser = await CreateSuperService.execute({
      email,
      name,
      password,
      phone,
    });

    res.status(201).json({
      message: "Super user created",
      superUser: instanceToPlain(superUser),
    });
  }
}

export default SuperController;
