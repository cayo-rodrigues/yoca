"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Ingredient_controller_1 = __importDefault(require("../controllers/Ingredient.controller"));
const validateBody_middleware_1 = __importDefault(require("../middlewares/validateBody.middleware"));
const validateUUID_middleware_1 = __importDefault(require("../middlewares/validateUUID.middleware"));
const verifyAccessLevel_middleware_1 = __importDefault(require("../middlewares/verifyAccessLevel.middleware"));
const createIngredient_schema_1 = __importDefault(require("../schemas/ingredients/createIngredient.schema"));
const updateIngredient_schema_1 = __importDefault(require("../schemas/ingredients/updateIngredient.schema"));
const ingredientsRoutes = (0, express_1.Router)();
ingredientsRoutes.use((0, verifyAccessLevel_middleware_1.default)(2));
ingredientsRoutes.post("/", (0, validateBody_middleware_1.default)(createIngredient_schema_1.default), Ingredient_controller_1.default.store);
ingredientsRoutes.get("/", Ingredient_controller_1.default.index);
ingredientsRoutes.use("/:id", validateUUID_middleware_1.default);
ingredientsRoutes.get("/:id", Ingredient_controller_1.default.show);
ingredientsRoutes.patch("/:id", (0, validateBody_middleware_1.default)(updateIngredient_schema_1.default), Ingredient_controller_1.default.update);
ingredientsRoutes.delete("/:id", Ingredient_controller_1.default.delete);
exports.default = ingredientsRoutes;
