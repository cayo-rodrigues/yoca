import { Router } from "express";

import ProductsController from "../controllers/Products.controller";
import verifyIdProductParamsMiddleware from "../middlewares/products/verifyIdProductParams.middleware";

const productsRoutes = Router();

productsRoutes.post("/", ProductsController.store);
productsRoutes.get("/", ProductsController.index);

productsRoutes.use(verifyIdProductParamsMiddleware);

productsRoutes.get("/:id", ProductsController.show);
productsRoutes.patch("/:id", ProductsController.update);
productsRoutes.delete("/:id", ProductsController.delete);

export default productsRoutes;
