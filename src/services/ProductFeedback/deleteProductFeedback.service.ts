import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import ProductFeedback from "../../models/ProductFeedback.model";

export default class DeleteProductFeedback {
  static async execute(id: string) {
    const productFeedbackRepository =
      AppDataSource.getRepository(ProductFeedback);
    const feedback = await productFeedbackRepository.findOne({ where: { id } });
    if (!feedback) {
      throw new AppError("Product Feedback not found", 404);
    }
    await productFeedbackRepository.softDelete(id);
    return feedback;
  }
}
