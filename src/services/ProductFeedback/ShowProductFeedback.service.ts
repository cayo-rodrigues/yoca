import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import { IUUID } from "../../interfaces/IdParam.interface";
import ProductFeedback from "../../models/ProductFeedback.model";

class ShowProductFeedbackService {
  static async execute({ id }: IUUID) {
    const productFeedbackRepository =
      AppDataSource.getRepository(ProductFeedback);

    const feedback = await productFeedbackRepository.findOne({ where: { id } });
    if (!feedback) {
      throw new AppError("Product feedback not found", 404);
    }

    return feedback;
  }
}

export default ShowProductFeedbackService;
