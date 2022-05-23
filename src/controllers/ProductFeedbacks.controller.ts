import { Request, Response } from "express";
import { IProductFeedback } from "../interfaces/ProductFeedback";
import CreateProductFeedback from "../services/ProductFeedback/createFeedback.service";
import DeleteProductFeedback from "../services/ProductFeedback/deleteProductFeedback.service";
import ListOneProductFeedback from "../services/ProductFeedback/listOneProductFeedback.service";
import ListProductFeedback from "../services/ProductFeedback/listProductFeedbacks.service";
import UpdateProductFeedback from "../services/ProductFeedback/updateGeneralFeedback.service";

export class ProductFeedbackController {
  static async store(req: Request, res: Response) {
    const feedback: IProductFeedback = req.body;
    const newFeedback = await CreateProductFeedback.execute(feedback);
    return res.status(201).json({
      message: "Product Feedback created",
      feedback: newFeedback,
    });
  }
  static async index(req: Request, res: Response) {
    const feedbacks = await ListProductFeedback.execute();
    return res.status(200).json(feedbacks);
  }
  static async indexOne(req: Request, res: Response) {
    const { id } = req.params;
    const feedback = await ListOneProductFeedback.execute(id);
    return res.status(200).json(feedback);
  }
  static async remove(req: Request, res: Response) {
    const { id } = req.params;
    const feedback = await DeleteProductFeedback.execute(id);
    return res.status(204).json();
  }
  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const feeedback: IProductFeedback = req.body;
    const updatedFeedback = await UpdateProductFeedback.execute(id, feeedback);
    return res.status(200).json({
      message: "Product Feedback updated",
      feedback: updatedFeedback,
    });
  }
}
