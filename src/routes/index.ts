import { Router } from "express";
import ensureAuthMiddleware from "../middlewares/ensureAuth.middleware";
import superRoute from "./super.route";
import sessionsRoute from "./sessions.route";
import employeeRoute from "./employee.route";

const router = Router();

router.use("/super", superRoute);

router.use("/sessions", sessionsRoute);

router.use(ensureAuthMiddleware);

router.use("/employees", employeeRoute);

export default router;
