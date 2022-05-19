import "express-async-errors";
import express from "express";
import cors from "cors";
import billsRoutes from "./routes/bills.routes";

import errorHandler from "./errors/handleError.middleware";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/bills", billsRoutes);

app.use(errorHandler);

export default app;
