import { Router } from "express";

import ensureAuthMiddleware from "../middlewares/ensureAuth.middleware";

import productsRoutes from "./products.routes";
import superRoutes from "./super.routes";
import sessionsRoutes from "./sessions.routes";
import employeesRoutes from "./employees.routes";
import ingredientsRoutes from "./ingredients.routes";
import generalFeedbackRoutes from "./generalFeedback.routes";
import productFeedbackRoutes from "./productFeedback.routes";

const routes = Router();

routes.use("/super", superRoutes);
routes.use("/sessions", sessionsRoutes);

routes.use(ensureAuthMiddleware);

routes.use("/employees", employeesRoutes);
routes.use("/ingredients", ingredientsRoutes);
routes.use("/products", productsRoutes);

routes.use("/feedbacks/general", generalFeedbackRoutes);
routes.use("/feedbacks/products", productFeedbackRoutes);

export default routes;
