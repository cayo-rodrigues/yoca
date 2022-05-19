import { Router } from "express";

import ProductsController from "../controllers/Products.controller";

const productsRouter = Router();

productsRouter.post("/", ProductsController.store);
productsRouter.get("/", ProductsController.index);

export default productsRouter;
