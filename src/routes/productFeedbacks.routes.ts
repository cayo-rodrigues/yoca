import { Router } from "express";

import ProductFeedbackController from "../controllers/ProductFeedbacks.controller";
import validateBodyMiddleware from "../middlewares/validateBody.middleware";
import validateUUIDMiddleware from "../middlewares/validateUUID.middleware";

import verifyAccessLevelMiddleware from "../middlewares/verifyAccessLevel.middleware";

import createProductFeedbackSchema from "../schemas/productFeedback/createProductFeedback.schema";

const productFeedbackRoutes = Router();

productFeedbackRoutes.post(
  "/",
  validateBodyMiddleware(createProductFeedbackSchema),
  ProductFeedbackController.store
);
productFeedbackRoutes.get("/", ProductFeedbackController.index);

productFeedbackRoutes.use("/:id", validateUUIDMiddleware);

productFeedbackRoutes.get("/:id", ProductFeedbackController.show);

productFeedbackRoutes.use("/:id", verifyAccessLevelMiddleware(2));

productFeedbackRoutes.delete("/:id", ProductFeedbackController.delete);

export default productFeedbackRoutes;
