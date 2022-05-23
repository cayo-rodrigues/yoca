import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import { IProductFeedback } from "../../interfaces/ProductFeedback";
import ProductFeedback from "../../models/ProductFeedback.model";

export default class UpdateProductFeedback {
  static async execute(id: string, feedback: IProductFeedback) {
    const productFeedbackRepository =
      AppDataSource.getRepository(ProductFeedback);
    const updatedFeedback = await productFeedbackRepository.preload({
      id,
      ...feedback,
    });
    if (!feedback) {
      throw new AppError("Product Feedback not found", 404);
    }
    await productFeedbackRepository.save(updatedFeedback as IProductFeedback);
    return updatedFeedback;
  }
}
