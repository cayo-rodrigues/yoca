import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";
import SuperController from "../controllers/Super.controller";
import createSuperUserSchema from "../schemas/superUser/createSuperUser.schema";

const superRoute = Router();

superRoute.post(
  "/",
  expressYupMiddleware({ schemaValidator: createSuperUserSchema }),
  SuperController.store
);

export default superRoute;
