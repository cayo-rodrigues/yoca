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
const CreateCategory_service_1 = __importDefault(require("../services/Categories/CreateCategory.service"));
const ListCategories_service_1 = __importDefault(require("../services/Categories/ListCategories.service"));
const ShowCategory_service_1 = __importDefault(require("../services/Categories/ShowCategory.service"));
const UpdateCategory_service_1 = __importDefault(require("../services/Categories/UpdateCategory.service"));
const DeleteCategory_service_1 = __importDefault(require("../services/Categories/DeleteCategory.service"));
class CategoriesController {
    static store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.body;
            const category = yield CreateCategory_service_1.default.execute({ name });
            res.status(201).json({
                message: "Category created",
                category: (0, class_transformer_1.instanceToPlain)(category),
            });
        });
    }
    static index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const per_page = req.query.per_page;
            const page = req.query.page;
            const categories = yield ListCategories_service_1.default.execute({
                per_page: +per_page,
                page: +page,
            });
            res.json((0, class_transformer_1.instanceToPlain)(categories));
        });
    }
    static show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const category = yield ShowCategory_service_1.default.execute({ id });
            res.json((0, class_transformer_1.instanceToPlain)(category));
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { name } = req.body;
            const category = yield UpdateCategory_service_1.default.execute({
                id,
                updateData: { name },
            });
            res.json({
                message: "Category updated",
                category: (0, class_transformer_1.instanceToPlain)(category),
            });
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield DeleteCategory_service_1.default.execute({ id });
            res.status(204).json();
        });
    }
}
exports.default = CategoriesController;
