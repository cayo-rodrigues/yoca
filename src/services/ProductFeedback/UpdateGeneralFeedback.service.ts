import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import {
  IProductFeedback,
  IUpdateProductFeedback,
} from "../../interfaces/ProductFeedback";
import ProductFeedback from "../../models/ProductFeedback.model";

class UpdateProductFeedbackService {
  static async execute(feedback: IUpdateProductFeedback) {
    const productFeedbackRepository =
      AppDataSource.getRepository(ProductFeedback);

    const updatedFeedback = await productFeedbackRepository.preload({
      ...feedback,
    });
    if (!feedback) {
      throw new AppError("Product Feedback not found", 404);
    }

    await productFeedbackRepository.save(updatedFeedback as IProductFeedback);

    return updatedFeedback;
  }
}

export default UpdateProductFeedbackService;
