import { Router } from "express";

import ingredientsRoutes from "./ingredients.routes";

const routes = Router();

routes.use("/ingredients", ingredientsRoutes);

export default routes;
