import { Router } from "express";

import SuperController from "../controllers/Super.controller";

import validateBodyMiddleware from "../middlewares/validateBody.middleware";

import createSuperUserSchema from "../schemas/super/createSuperUser.schema";

const superRoutes = Router();

superRoutes.post(
  "/",
  validateBodyMiddleware(createSuperUserSchema),
  SuperController.store
);

export default superRoutes;
