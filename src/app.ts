import express from "express";
import "express-async-errors";
import cors from "cors";
import errorHandler from "./errors/handleError.middleware";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use(errorHandler);

export default app;
