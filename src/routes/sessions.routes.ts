import { Router } from "express";

import SessionsController from "../controllers/Sessions.controller";
import validateBodyMiddleware from "../middlewares/validateBody.middleware";
import validateLoginSchema from "../schemas/sessions/validateLogin.schema";

const sessionsRoutes = Router();

sessionsRoutes.post(
  "/",
  validateBodyMiddleware(validateLoginSchema),
  SessionsController.authenticate
);

export default sessionsRoutes;
