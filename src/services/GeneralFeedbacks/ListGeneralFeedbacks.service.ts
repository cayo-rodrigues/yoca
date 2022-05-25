import AppDataSource from "../../data-source";
import { IList } from "../../interfaces/List.interface";
import GeneralFeedback from "../../models/GeneralFeedback.model";

class ListGeneralFeedbacksService {
  static async execute({ per_page, page }: IList) {
    const generalFeedbackRepository =
      AppDataSource.getRepository(GeneralFeedback);

    if (!per_page) {
      per_page = 20;
    }

    if (!page) {
      page = 1;
    }

    return await generalFeedbackRepository.find({
      skip: per_page * (page - 1),
      take: per_page,
    });
  }
}

export default ListGeneralFeedbacksService;
