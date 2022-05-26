import AppDataSource from "../../data-source";
import { IList } from "../../interfaces/List.interface";
import ProductFeedback from "../../models/ProductFeedback.model";

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
        : `urlDoHeroku/bills?per_page=${per_page}&page=${page - 1}`;

    const next =
      page >= pages
        ? null
        : `urlDoHeroku/bills?per_page=${per_page}&page=${page + 1}`;

    const productFeedbacks = await productFeedbackRepository.find({
      skip: per_page * (page - 1),
      take: per_page,
    });

    return {
      productFeedbacks,
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
