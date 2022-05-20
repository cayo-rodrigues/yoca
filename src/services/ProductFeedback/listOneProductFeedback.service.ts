import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import GeneralFeedback from "../../models/GeneralFeedback.model";
import ProductFeedback from "../../models/ProductFeedback.model";

export default class ListOneProductFeedback {
  static async execute(id: string) {
    const productFeedbackRepository =
      AppDataSource.getRepository(ProductFeedback);
    const feedback = await productFeedbackRepository.findOne({ where: { id } });
    if (!feedback) {
      throw new AppError("Product Feedback not found", 404);
    }
    return feedback;
  }
}
