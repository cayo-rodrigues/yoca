import { Router } from "express";

import GeneralFeedbackController from "../controllers/GeneralFeedbacks.controller";

import validateBodyMiddleware from "../middlewares/validateBody.middleware";
import validateUUIDMiddleware from "../middlewares/validateUUID.middleware";
import verifyAccessLevelMiddleware from "../middlewares/verifyAccessLevel.middleware";

import createGeneralFeedbackSchema from "../schemas/generalFeedback/createGeneralFeedback.schema";

const generalFeedbackRoutes = Router();

generalFeedbackRoutes.post(
  "/",
  validateBodyMiddleware(createGeneralFeedbackSchema),
  GeneralFeedbackController.store
);
generalFeedbackRoutes.get("/", GeneralFeedbackController.index);

generalFeedbackRoutes.use("/:id", validateUUIDMiddleware);

generalFeedbackRoutes.get("/:id", GeneralFeedbackController.show);

generalFeedbackRoutes.use("/:id", verifyAccessLevelMiddleware(2));

generalFeedbackRoutes.delete("/:id", GeneralFeedbackController.delete);

export default generalFeedbackRoutes;
