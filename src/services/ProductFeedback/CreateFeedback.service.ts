import AppDataSource from "../../data-source";
import { IProductFeedback } from "../../interfaces/ProductFeedback";
import ProductFeedback from "../../models/ProductFeedback.model";

class CreateProductFeedbackService {
  static async execute(feedbackInfo: IProductFeedback) {
    const productFeedbackRepo = AppDataSource.getRepository(ProductFeedback);

    const newFeedback = productFeedbackRepo.create(feedbackInfo);
    await productFeedbackRepo.save(newFeedback);

    return newFeedback;
  }
}

export default CreateProductFeedbackService;
