import { instanceToPlain } from "class-transformer";
import { Request, Response } from "express";

import { IProductFeedback } from "../interfaces/ProductFeedback";
import CreateProductFeedbackService from "../services/ProductFeedback/CreateFeedback.service";
import DeleteProductFeedbackService from "../services/ProductFeedback/DeleteProductFeedback.service";
import ListProductFeedbacksService from "../services/ProductFeedback/ListProductFeedbacks.service";
import ShowProductFeedbackService from "../services/ProductFeedback/ShowProductFeedback.service";

class ProductFeedbackController {
  static async store(req: Request, res: Response) {
    const { description, productId, rating }: IProductFeedback = req.body;

    const newFeedback = await CreateProductFeedbackService.execute({
      description,
      productId,
      rating,
    });

    return res.status(201).json({
      message: "Product feedback created",
      feedback: instanceToPlain(newFeedback),
    });
  }

  static async index(req: Request, res: Response) {
    const per_page = req.query.per_page as string;
    const page = req.query.page as string;

    const feedbacks = await ListProductFeedbacksService.execute({
      per_page: +per_page,
      page: +page,
    });

    return res.json(instanceToPlain(feedbacks));
  }

  static async show(req: Request, res: Response) {
    const { id } = req.params;

    const feedback = await ShowProductFeedbackService.execute({ id });

    return res.json(instanceToPlain(feedback));
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    await DeleteProductFeedbackService.execute({ id });

    return res.status(204).json();
  }
}

export default ProductFeedbackController;
