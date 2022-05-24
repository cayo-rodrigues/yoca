import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";

import ProductFeedbackController from "../controllers/ProductFeedbacks.controller";

import verifyAccessLevelMiddleware from "../middlewares/verifyAccessLevel.middleware";

import createProductFeedbackSchema from "../schemas/productFeedback/createFeedback.schema";
import validateUUIDSchema from "../schemas/validateUUID.schema";

const productFeedbackRoutes = Router();

productFeedbackRoutes.post(
  "/",
  expressYupMiddleware({ schemaValidator: createProductFeedbackSchema }),
  ProductFeedbackController.store
);
productFeedbackRoutes.get("/", ProductFeedbackController.index);

productFeedbackRoutes.use(
  "/:id",
  expressYupMiddleware({ schemaValidator: validateUUIDSchema })
);

productFeedbackRoutes.get("/:id", ProductFeedbackController.show);

productFeedbackRoutes.use("/:id", verifyAccessLevelMiddleware(2));

productFeedbackRoutes.patch("/:id", ProductFeedbackController.update);

productFeedbackRoutes.delete("/:id", ProductFeedbackController.delete);

export default productFeedbackRoutes;
