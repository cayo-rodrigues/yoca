import "express-async-errors";
import express from "express";
import cors from "cors";

import errorHandler from "./errors/handleError.middleware";

import routes from "./routes";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use(routes);

app.use(errorHandler);

export default app;
