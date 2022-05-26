import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import { IUUID } from "../../interfaces/IdParam.interface";
import GeneralFeedback from "../../models/GeneralFeedback.model";

class DeleteGeneralFeedbackService {
  static async execute({ id }: IUUID) {
    const generalFeedbackRepository =
      AppDataSource.getRepository(GeneralFeedback);

    const feedback = await generalFeedbackRepository.findOne({ where: { id } });
    if (!feedback) {
      throw new AppError("General feedback not found", 404);
    }

    await generalFeedbackRepository.delete(id);

    return feedback;
  }
}

export default DeleteGeneralFeedbackService;
