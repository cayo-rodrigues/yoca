import AppDataSource from "../../data-source";
import { IProductFeedback } from "../../interfaces/ProductFeedback";
import ProductFeedback from "../../models/ProductFeedback.model";

export default class CreateProductFeedback {
  static async execute(feedback: IProductFeedback) {
    const productFeedbackRepository =
      AppDataSource.getRepository(ProductFeedback);
    const newFeedback = await productFeedbackRepository.save(feedback);
    return newFeedback;
  }
}
