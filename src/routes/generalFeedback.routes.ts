import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";

import GeneralFeedbackController from "../controllers/GeneralFeedbacks.controller";

import verifyAccessLevelMiddleware from "../middlewares/verifyAccessLevel.middleware";

import createGeneralFeedbackSchema from "../schemas/generalFeedback/createFeedback.schema";
import validateUUIDSchema from "../schemas/validateUUID.schema";

const generalFeedbackRoutes = Router();

generalFeedbackRoutes.post(
  "/",
  expressYupMiddleware({ schemaValidator: createGeneralFeedbackSchema }),
  GeneralFeedbackController.store
);
generalFeedbackRoutes.get("/", GeneralFeedbackController.index);

generalFeedbackRoutes.use(
  "/:id",
  expressYupMiddleware({ schemaValidator: validateUUIDSchema })
);

generalFeedbackRoutes.get("/:id", GeneralFeedbackController.show);

generalFeedbackRoutes.use("/:id", verifyAccessLevelMiddleware(2));

generalFeedbackRoutes.patch("/:id", GeneralFeedbackController.update);

generalFeedbackRoutes.delete("/:id", GeneralFeedbackController.delete);

export default generalFeedbackRoutes;
