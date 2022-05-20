import AppDataSource from "../../data-source";
import ProductFeedback from "../../models/ProductFeedback.model";

export default class ListProductFeedback {
  static async execute() {
    const productFeedbackRepository =
      AppDataSource.getRepository(ProductFeedback);
    const feedbacks = await productFeedbackRepository.find();
    return feedbacks;
  }
}
