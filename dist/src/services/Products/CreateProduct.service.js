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
const data_source_1 = __importDefault(require("../../data-source"));
const Product_model_1 = __importDefault(require("../../models/Product.model"));
const ProductCategory_model_1 = __importDefault(require("../../models/ProductCategory.model"));
const ProductsIngredients_model_1 = __importDefault(require("../../models/ProductsIngredients.model"));
class CreateProductService {
    static execute({ name, price, calories, ingredients, categories, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const productsRepo = data_source_1.default.getRepository(Product_model_1.default);
            const productsIngredientsRepo = data_source_1.default.getRepository(ProductsIngredients_model_1.default);
            const productsCategoriesRepo = data_source_1.default.getRepository(ProductCategory_model_1.default);
            const product = productsRepo.create({ name, price, calories });
            yield productsRepo.save(product);
            ingredients.forEach((ingredient) => __awaiter(this, void 0, void 0, function* () {
                const productIngredient = productsIngredientsRepo.create({
                    ingredientId: ingredient.id,
                    productId: product.id,
                    amount: ingredient.amount,
                });
                yield productsIngredientsRepo.save(productIngredient);
            }));
            categories.forEach((categoryId) => __awaiter(this, void 0, void 0, function* () {
                const productCategory = productsCategoriesRepo.create({
                    productId: product.id,
                    categoryId,
                });
                yield productsCategoriesRepo.save(productCategory);
            }));
            return product;
        });
    }
}
exports.default = CreateProductService;
