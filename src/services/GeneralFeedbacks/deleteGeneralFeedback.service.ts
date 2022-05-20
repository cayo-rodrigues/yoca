import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import GeneralFeedback from "../../models/GeneralFeedback.model";

export default class DeleteGeneralFeedback {
  static async execute(id: string) {
    const generalFeedbackRepository =
      AppDataSource.getRepository(GeneralFeedback);
    const feedback = await generalFeedbackRepository.findOne({ where: { id } });
    if (!feedback) {
      throw new AppError("General Feedback not found", 404);
    }
    await generalFeedbackRepository.delete(id);
    return feedback;
  }
}
