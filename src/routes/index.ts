import { Router } from "express";
import ensureAuthMiddleware from "../middlewares/ensureAuth.middleware";
import superRoute from "./super.route";
import sessionsRoute from "./sessions.route";
import employeeRoute from "./employee.route";
import ingredientsRoutes from "./ingredients.routes";
import ordersRoutes from "./orders.routes";
import billsRoutes from "./bills.routes";

const routes = Router();

routes.use("/super", superRoute);

routes.use("/sessions", sessionsRoute);

// routes.use(ensureAuthMiddleware);

routes.use("/bills", billsRoutes);

routes.use("/orders", ordersRoutes);

routes.use("/employees", employeeRoute);

routes.use("/ingredients", ingredientsRoutes);

export default routes;
