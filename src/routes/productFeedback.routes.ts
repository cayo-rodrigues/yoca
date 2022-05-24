import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";
import { ProductFeedbackController } from "../controllers/ProductFeedbacks.controller";
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

productFeedbackRoutes.get("/:id", ProductFeedbackController.indexOne);

productFeedbackRoutes.use("/:id", verifyAccessLevelMiddleware(2));

productFeedbackRoutes.delete("/:id", ProductFeedbackController.remove);

productFeedbackRoutes.patch("/:id", ProductFeedbackController.update);

export default productFeedbackRoutes;
