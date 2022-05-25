import AppDataSource from "../../data-source";
import { IList } from "../../interfaces/List.interface";
import ProductFeedback from "../../models/ProductFeedback.model";

class ListProductFeedbacksService {
  static async execute({per_page, page}: IList) {
    const productFeedbackRepository =
      AppDataSource.getRepository(ProductFeedback);

      if (!per_page) {
        per_page = 20;
      }
  
      if (!page) {
        page = 1;
      }
  
      return await productFeedbackRepository.find({
        skip: per_page * (page - 1),
        take: per_page,
      });
  }
}

export default ListProductFeedbacksService;
