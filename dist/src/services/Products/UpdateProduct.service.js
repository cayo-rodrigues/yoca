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
const Product_model_1 = __importDefault(require("../../models/Product.model"));
const ProductCategory_model_1 = __importDefault(require("../../models/ProductCategory.model"));
const ProductsIngredients_model_1 = __importDefault(require("../../models/ProductsIngredients.model"));
class UpdateProductService {
    static execute({ id, name, price, calories, ingredients, categories, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const productsRepo = data_source_1.default.getRepository(Product_model_1.default);
            const product = yield productsRepo.findOne({ where: { id } });
            if (!product) {
                throw new AppError_1.default("Product not found", 404);
            }
            if (ingredients === null || ingredients === void 0 ? void 0 : ingredients.length) {
                const productsIngredientsRepo = data_source_1.default.getRepository(ProductsIngredients_model_1.default);
                const productOldIngredients = yield productsIngredientsRepo.findBy({
                    id: (0, typeorm_1.In)(product.ingredients.map(({ id }) => id)),
                });
                productOldIngredients.forEach(({ id }) => __awaiter(this, void 0, void 0, function* () {
                    yield productsIngredientsRepo.delete({ id });
                }));
                ingredients.forEach(({ id, amount }) => __awaiter(this, void 0, void 0, function* () {
                    const productIngredient = productsIngredientsRepo.create({
                        ingredientId: id,
                        productId: product.id,
                        amount,
                    });
                    yield productsIngredientsRepo.save(productIngredient);
                }));
            }
            if (categories === null || categories === void 0 ? void 0 : categories.length) {
                const productsCategoriesRepo = data_source_1.default.getRepository(ProductCategory_model_1.default);
                const productOldCategories = yield productsCategoriesRepo.findBy({
                    id: (0, typeorm_1.In)(product.categories.map(({ id }) => id)),
                });
                productOldCategories.forEach(({ id }) => __awaiter(this, void 0, void 0, function* () {
                    yield productsCategoriesRepo.delete({ id });
                }));
                categories.forEach((categoryId) => __awaiter(this, void 0, void 0, function* () {
                    const productCategory = productsCategoriesRepo.create({
                        productId: product.id,
                        categoryId,
                    });
                    yield productsCategoriesRepo.save(productCategory);
                }));
            }
            product.name = name ? name : product.name;
            product.price = price ? price : product.price;
            product.calories = calories ? calories : product.calories;
            yield productsRepo.update(product.id, {
                name: product.name,
                price: product.price,
                calories: product.calories,
            });
            return product;
        });
    }
}
exports.default = UpdateProductService;
