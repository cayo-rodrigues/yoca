import AppDataSource from "../../data-source";
import GeneralFeedback from "../../models/GeneralFeedback.model";

export default class ListGeneralFeedback {
  static async execute() {
    const generalFeedbackRepository =
      AppDataSource.getRepository(GeneralFeedback);
    const feedbacks = await generalFeedbackRepository.find();
    return feedbacks;
  }
}
