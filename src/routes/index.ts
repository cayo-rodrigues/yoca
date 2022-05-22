import { Router } from "express";

import ensureAuthMiddleware from "../middlewares/ensureAuth.middleware";

import productsRoutes from "./products.routes";
import superRoutes from "./super.routes";
import sessionsRoutes from "./sessions.routes";
import employeeRoutes from "./employee.routes";
import ingredientsRoutes from "./ingredients.routes";
import generalFeedbackRoutes from "./generalFeedback.routes";
import ordersRoutes from "./orders.routes";
import billsRoutes from "./bills.routes";

const routes = Router();

routes.use("/super", superRoutes);
routes.use("/sessions", sessionsRoutes);

routes.use("/feedbacks/general", generalFeedbackRoutes);

routes.use(ensureAuthMiddleware);

routes.use("/employees", employeeRoutes);
routes.use("/ingredients", ingredientsRoutes);
routes.use("/products", productsRoutes);
routes.use("/orders", ordersRoutes);
routes.use("/bills", billsRoutes);

export default routes;
