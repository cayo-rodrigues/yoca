import { Router } from "express";
import ensureAuthMiddleware from "../middlewares/ensureAuth.middleware";
import sessionsRoute from "./sessions.route";
import employeeRoute from "./employee.route";

const router = Router();

router.use("/sessions", sessionsRoute);

router.use(ensureAuthMiddleware);

router.use("/employees", employeeRoute);
export default router;
