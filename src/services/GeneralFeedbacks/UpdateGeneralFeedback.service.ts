import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import { IGeneralFeedback } from "../../interfaces/GeneralFeedback.interface";
import GeneralFeedback from "../../models/GeneralFeedback.model";

export default class UpdateGeneralFeedback {
  static async execute(id: string, feedback: IGeneralFeedback) {
    const generalFeedbackRepository =
      AppDataSource.getRepository(GeneralFeedback);

    const updatedFeedback = await generalFeedbackRepository.preload({
      id,
      ...feedback,
    });
    if (!feedback) {
      throw new AppError("General Feedback not found", 404);
    }

    await generalFeedbackRepository.save(updatedFeedback as IGeneralFeedback);

    return updatedFeedback;
  }
}
