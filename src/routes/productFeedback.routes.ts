import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";
import { ProductFeedbackController } from "../controllers/ProductFeedbacks.controller";
import createProductFeedbackSchema from "../schemas/productFeedback/createFeedback.schema";

const productFeedbackRoutes = Router();

productFeedbackRoutes.post(
  "/",
  expressYupMiddleware({ schemaValidator: createProductFeedbackSchema }),
  ProductFeedbackController.store
);
productFeedbackRoutes.get("/", ProductFeedbackController.index);

productFeedbackRoutes.get("/:id", ProductFeedbackController.indexOne);

productFeedbackRoutes.delete("/:id", ProductFeedbackController.remove);

productFeedbackRoutes.patch("/:id", ProductFeedbackController.update);

export default productFeedbackRoutes;
