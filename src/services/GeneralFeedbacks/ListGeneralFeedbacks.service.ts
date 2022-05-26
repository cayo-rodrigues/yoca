import AppDataSource from "../../data-source";
import { IList } from "../../interfaces/List.interface";
import GeneralFeedback from "../../models/GeneralFeedback.model";
import { getUrl } from "../../utils";

class ListGeneralFeedbacksService {
  static async execute({ per_page, page }: IList): Promise<any> {
    const generalFeedbackRepository =
      AppDataSource.getRepository(GeneralFeedback);

    if (!per_page) {
      per_page = 20;
    }

    if (!page) {
      page = 1;
    }

    const count = await generalFeedbackRepository.count();

    const pages = Math.ceil(count / per_page);

    const prev =
      page <= 1
        ? null
        : `${getUrl()}/feedbacks/general?per_page=${per_page}&page=${page - 1}`;

    const next =
      page >= pages
        ? null
        : `${getUrl()}/feedbacks/general?per_page=${per_page}&page=${page + 1}`;

    const employees = await generalFeedbackRepository.find({
      skip: per_page * (page - 1),
      take: per_page,
    });

    return {
      results: employees,
      info: {
        count,
        pages,
        next,
        prev,
      },
    };
  }
}

export default ListGeneralFeedbacksService;
