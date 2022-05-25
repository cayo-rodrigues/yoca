import { Router } from "express";

import ensureAuthMiddleware from "../middlewares/ensureAuth.middleware";

import productsRoutes from "./products.routes";
import superRoutes from "./super.routes";
import sessionsRoutes from "./sessions.routes";
import employeesRoutes from "./employees.routes";
import ingredientsRoutes from "./ingredients.routes";
import generalFeedbackRoutes from "./generalFeedbacks.routes";
import ordersRoutes from "./orders.routes";
import billsRoutes from "./bills.routes";
import productFeedbackRoutes from "./productFeedbacks.routes";
import categoriesRoutes from "./categories.routes";

const routes = Router();

routes.use("/super", superRoutes);
routes.use("/sessions", sessionsRoutes);

routes.use("/feedbacks/general", generalFeedbackRoutes);
routes.use("/feedbacks/products", productFeedbackRoutes);

routes.use(ensureAuthMiddleware);

routes.use("/employees", employeesRoutes);
routes.use("/categories", categoriesRoutes);
routes.use("/ingredients", ingredientsRoutes);
routes.use("/products", productsRoutes);
routes.use("/orders", ordersRoutes);
routes.use("/bills", billsRoutes);

export default routes;
