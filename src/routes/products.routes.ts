import { Router } from "express";

import ProductsController from "../controllers/Products.controller";

const productsRoutes = Router();

productsRoutes.post("/", ProductsController.store);
productsRoutes.get("/", ProductsController.index);

export default productsRoutes;
