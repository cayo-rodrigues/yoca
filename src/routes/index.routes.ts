import { Router } from "express";
import ensureAuthMiddleware from "../middlewares/ensureAuth.middleware";
import superRoute from "./super.routes";
import sessionsRoute from "./sessions.routes";
import employeesRoutes from "./employees.routes";
import ingredientsRoutes from "./ingredients.routes";

const routes = Router();

routes.use("/super", superRoute);

routes.use("/sessions", sessionsRoute);

routes.use(ensureAuthMiddleware);

routes.use("/employees", employeesRoutes);

routes.use("/ingredients", ingredientsRoutes);

export default routes;
