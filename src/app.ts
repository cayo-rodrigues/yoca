import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import errorHandler from "./errors/handleError.middleware";

import routes from "./routes";
import swaggerDocs from "./swagger.json";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(routes);

app.use(errorHandler);

export default app;
