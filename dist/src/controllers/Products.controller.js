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
const class_transformer_1 = require("class-transformer");
const CreateProduct_service_1 = __importDefault(require("../services/Products/CreateProduct.service"));
const ListProducts_service_1 = __importDefault(require("../services/Products/ListProducts.service"));
const ShowProduct_service_1 = __importDefault(require("../services/Products/ShowProduct.service"));
const DeleteProduct_service_1 = __importDefault(require("../services/Products/DeleteProduct.service"));
const UpdateProduct_service_1 = __importDefault(require("../services/Products/UpdateProduct.service"));
class ProductsController {
    static store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, price, calories, ingredients, categories } = req.body;
            const product = yield CreateProduct_service_1.default.execute({
                name,
                price,
                calories,
                ingredients,
                categories,
            });
            return res
                .status(201)
                .json({ message: "Product created", product: (0, class_transformer_1.instanceToPlain)(product) });
        });
    }
    static index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const per_page = req.query.per_page;
            const page = req.query.page;
            const products = yield ListProducts_service_1.default.execute({
                per_page: +per_page,
                page: +page,
            });
            return res.json((0, class_transformer_1.instanceToPlain)(products));
        });
    }
    static show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const product = yield ShowProduct_service_1.default.execute({ id });
            return res.json((0, class_transformer_1.instanceToPlain)(product));
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { name, price, calories, ingredients, categories } = req.body;
            const productUpdated = yield UpdateProduct_service_1.default.execute({
                id,
                name,
                price,
                calories,
                ingredients,
                categories,
            });
            return res.json({
                message: "Product updated",
                product: (0, class_transformer_1.instanceToPlain)(productUpdated),
            });
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield DeleteProduct_service_1.default.execute({ id });
            return res.status(204).json();
        });
    }
}
exports.default = ProductsController;
