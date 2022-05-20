import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";
import SuperController from "../controllers/Super.controller";
import createSuperUserSchema from "../schemas/super/createSuperUser.schema";

const superRoutes = Router();

superRoutes.post(
  "/",
  expressYupMiddleware({ schemaValidator: createSuperUserSchema }),
  SuperController.store
);

export default superRoutes;
