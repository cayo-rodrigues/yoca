import AppDataSource from "../../data-source";
import { IList } from "../../interfaces/List.interface";
import ProductFeedback from "../../models/ProductFeedback.model";
import { getUrl } from "../../utils";

class ListProductFeedbacksService {
  static async execute({ per_page, page }: IList) {
    const productFeedbackRepository =
      AppDataSource.getRepository(ProductFeedback);

    if (!per_page) {
      per_page = 20;
    }

    if (!page) {
      page = 1;
    }

    const count = await productFeedbackRepository.count();

    const pages = Math.ceil(count / per_page);

    const prev =
      page <= 1
        ? null
        : `${getUrl()}/feedbacks/products?per_page=${per_page}&page=${
            page - 1
          }`;

    const next =
      page >= pages
        ? null
        : `${getUrl()}/feedbacks/products?per_page=${per_page}&page=${
            page + 1
          }`;

    const productFeedbacks = await productFeedbackRepository.find({
      skip: per_page * (page - 1),
      take: per_page,
    });

    return {
      results: productFeedbacks,
      info: {
        count,
        pages,
        next,
        prev,
      },
    };
  }
}

export default ListProductFeedbacksService;
