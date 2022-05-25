import { Router } from "express";

import SessionsController from "../controllers/Sessions.controller";

const sessionsRoutes = Router();

sessionsRoutes.post("/", SessionsController.authenticate);

export default sessionsRoutes;
