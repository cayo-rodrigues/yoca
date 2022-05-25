import AppDataSource from "../../data-source";
import GeneralFeedback from "../../models/GeneralFeedback.model";

class ListGeneralFeedbacksService {
  static async execute() {
    const generalFeedbackRepository =
      AppDataSource.getRepository(GeneralFeedback);

    const feedbacks = await generalFeedbackRepository.find();

    return feedbacks;
  }
}

export default ListGeneralFeedbacksService;
