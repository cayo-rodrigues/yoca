import { instanceToPlain } from "class-transformer";
import { Request, Response } from "express";
import { IGeneralFeedback } from "../interfaces/GeneralFeedback.interface";
import GeneralFeedback from "../models/GeneralFeedback.model";
import CreateGeneralFeedback from "../services/GeneralFeedbacks/createFeedback.service";
import DeleteGeneralFeedback from "../services/GeneralFeedbacks/deleteGeneralFeedback.service";
import ListGeneralFeedback from "../services/GeneralFeedbacks/listGeneralFeedbacks.service";
import ListOneGeneralFeedback from "../services/GeneralFeedbacks/listOneGeneralFeedback.service";
import UpdateGeneralFeedback from "../services/GeneralFeedbacks/updateGeneralFeedback.service";

export class GeneralFeedbackController {
  static async store(req: Request, res: Response) {
    const feedback = req.body;
    const newFeedback = await CreateGeneralFeedback.execute(feedback);

    return res.status(201).json({
      message: "General Feedback created",
      feedback: instanceToPlain(newFeedback),
    });
  }

  static async index(req: Request, res: Response) {
    const feedbacks = await ListGeneralFeedback.execute();
    return res.status(200).json(instanceToPlain(feedbacks));
  }

  static async indexOne(req: Request, res: Response) {
    const { id } = req.params;

    const feedback = await ListOneGeneralFeedback.execute(id);

    return res.status(200).json(instanceToPlain(feedback));
  }

  static async remove(req: Request, res: Response) {
    const { id } = req.params;

    const feedback = await DeleteGeneralFeedback.execute(id);

    return res.status(204).json();
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const feeedback = req.body as IGeneralFeedback;

    const updatedFeedback = await UpdateGeneralFeedback.execute(id, feeedback);

    return res.status(200).json({
      message: "General Feedback updated",
      feedback: instanceToPlain(updatedFeedback),
    });
  }
}
