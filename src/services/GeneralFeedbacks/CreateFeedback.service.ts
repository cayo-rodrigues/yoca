import AppDataSource from "../../data-source";
import { IGeneralFeedback } from "../../interfaces/GeneralFeedback.interface";
import GeneralFeedback from "../../models/GeneralFeedback.model";

class CreateGeneralFeedbackService {
  static async execute(feedback: IGeneralFeedback) {
    const generalFeedbackRepository =
      AppDataSource.getRepository(GeneralFeedback);

    const newFeedback = generalFeedbackRepository.create(feedback);

    await generalFeedbackRepository.save(newFeedback);

    return newFeedback;
  }
}

export default CreateGeneralFeedbackService;
