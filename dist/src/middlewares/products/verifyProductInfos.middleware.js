"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const data_source_1 = __importDefault(require("../../data-source"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Category_model_1 = __importDefault(require("../../models/Category.model"));
const Ingredient_model_1 = __importDefault(require("../../models/Ingredient.model"));
const Product_model_1 = __importDefault(require("../../models/Product.model"));
const verifyProductInfosMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productsRepo = data_source_1.default.getRepository(Product_model_1.default);
    const ingredientsRepo = data_source_1.default.getRepository(Ingredient_model_1.default);
    const categoriesRepo = data_source_1.default.getRepository(Category_model_1.default);
    const { name, ingredients, categories } = req.body;
    const productAlreadyExists = yield productsRepo.findOne({
        where: { name },
    });
    if (productAlreadyExists) {
        throw new AppError_1.default("Product with this name already exists", 409);
    }
    const allIngredients = yield ingredientsRepo.findBy({
        id: (0, typeorm_1.In)(ingredients.map(({ id }) => id)),
    });
    if (allIngredients.length !== ingredients.length) {
        throw new AppError_1.default("Invalid list of ingredients ids", 400);
    }
    const allCategories = yield categoriesRepo.findBy({
        id: (0, typeorm_1.In)(categories),
    });
    if (allCategories.length !== categories.length) {
        throw new AppError_1.default("Invalid list of categories ids", 400);
    }
    return next();
});
exports.default = verifyProductInfosMiddleware;
