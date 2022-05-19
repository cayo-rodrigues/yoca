import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";
import { GeneralFeedbackController } from "../controllers/GeneralFeedbacks.controller";
import createGeneralFeedbackSchema from "../schemas/generalFeedback/createFeedback.schema";

const generalFeedbackRoute = Router();

generalFeedbackRoute.post(
  "/",
  expressYupMiddleware({ schemaValidator: createGeneralFeedbackSchema }),
  GeneralFeedbackController.store
);
generalFeedbackRoute.get("/", GeneralFeedbackController.index);

generalFeedbackRoute.get("/:id", GeneralFeedbackController.indexOne);

generalFeedbackRoute.delete("/:id", GeneralFeedbackController.remove);

generalFeedbackRoute.patch("/:id", GeneralFeedbackController.update);

export default generalFeedbackRoute;
