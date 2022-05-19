import { Router } from "express";
import ensureAuthMiddleware from "../middlewares/ensureAuth.middleware";
import employeeRoute from "./employee.route";

const router = Router();

router.use(ensureAuthMiddleware);

router.use("/employees", employeeRoute);
export default router;
