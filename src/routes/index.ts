import { Router } from "express";
import ensureAuthMiddleware from "../middlewares/ensureAuth.middleware";
import superRoute from "./super.route";
import sessionsRoute from "./sessions.route";
import employeeRoute from "./employee.route";
import ingredientsRoutes from "./ingredients.routes";

const routes = Router();

routes.use("/super", superRoute);

routes.use("/sessions", sessionsRoute);

routes.use(ensureAuthMiddleware);

routes.use("/employees", employeeRoute);

routes.use("/ingredients", ingredientsRoutes);

export default routes;
