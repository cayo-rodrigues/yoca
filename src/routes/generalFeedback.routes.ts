import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";
import { GeneralFeedbackController } from "../controllers/GeneralFeedbacks.controller";
import createGeneralFeedbackSchema from "../schemas/generalFeedback/createFeedback.schema";

const generalFeedbackRoutes = Router();

generalFeedbackRoutes.post(
  "/",
  expressYupMiddleware({ schemaValidator: createGeneralFeedbackSchema }),
  GeneralFeedbackController.store
);
generalFeedbackRoutes.get("/", GeneralFeedbackController.index);

generalFeedbackRoutes.get("/:id", GeneralFeedbackController.indexOne);

generalFeedbackRoutes.delete("/:id", GeneralFeedbackController.remove);

generalFeedbackRoutes.patch("/:id", GeneralFeedbackController.update);

export default generalFeedbackRoutes;
