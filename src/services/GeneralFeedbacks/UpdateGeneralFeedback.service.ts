import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import {
  IGeneralFeedback,
  IUpdateGeneralFeedback,
} from "../../interfaces/GeneralFeedback.interface";
import GeneralFeedback from "../../models/GeneralFeedback.model";

class UpdateGeneralFeedback {
  static async execute(feedback: IUpdateGeneralFeedback) {
    const generalFeedbackRepository =
      AppDataSource.getRepository(GeneralFeedback);

    const updatedFeedback = await generalFeedbackRepository.preload({
      ...feedback,
    });
    if (!feedback) {
      throw new AppError("General Feedback not found", 404);
    }

    await generalFeedbackRepository.save(updatedFeedback as IGeneralFeedback);

    return updatedFeedback;
  }
}

export default UpdateGeneralFeedback;
