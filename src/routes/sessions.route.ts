import { Router } from "express";
import SessionsController from "../controllers/Sessions.controller";

const sessionsRoute = Router();

sessionsRoute.post("/", SessionsController.authenticate);

export default sessionsRoute;
