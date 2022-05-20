import AppDataSource from "../../data-source";
import { IGeneralFeedback } from "../../interfaces/GeneralFeedback.interface";
import GeneralFeedback from "../../models/GeneralFeedback.model";

export default class CreateGeneralFeedback {
  static async execute(feedback: IGeneralFeedback) {
    const generalFeedbackRepository =
      AppDataSource.getRepository(GeneralFeedback);
    const newFeedback = await generalFeedbackRepository.save(feedback);
    return newFeedback;
  }
}
