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
const CreateIngredient_service_1 = __importDefault(require("../services/Ingredients/CreateIngredient.service"));
const DeleteIngredient_service_1 = __importDefault(require("../services/Ingredients/DeleteIngredient.service"));
const ListIngredients_service_1 = __importDefault(require("../services/Ingredients/ListIngredients.service"));
const ShowIngredient_service_1 = __importDefault(require("../services/Ingredients/ShowIngredient.service"));
const UpdateIngredient_service_1 = __importDefault(require("../services/Ingredients/UpdateIngredient.service"));
class IngredientController {
    static store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { amount, amountMax, amountMin, measure, name } = req.body;
            const ingredient = yield CreateIngredient_service_1.default.execute({
                amount,
                amountMax,
                amountMin,
                measure,
                name,
            });
            return res.status(201).send({
                message: "Ingredient created",
                ingredient: (0, class_transformer_1.instanceToPlain)(ingredient),
            });
        });
    }
    static index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const per_page = req.query.per_page;
            const page = req.query.page;
            const ingredients = yield ListIngredients_service_1.default.execute({
                per_page: +per_page,
                page: +page,
            });
            return res.json((0, class_transformer_1.instanceToPlain)(ingredients));
        });
    }
    static show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const ingredient = yield ShowIngredient_service_1.default.execute({ id });
            return res.json((0, class_transformer_1.instanceToPlain)(ingredient));
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { amount, amountMax, amountMin, measure, name } = req.body;
            const updatedIngredient = yield UpdateIngredient_service_1.default.execute({
                id,
                amount,
                amountMax,
                amountMin,
                measure,
                name,
            });
            return res.json({
                message: "Ingredient updated",
                ingredient: (0, class_transformer_1.instanceToPlain)(updatedIngredient),
            });
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield DeleteIngredient_service_1.default.execute({ id });
            return res.status(204).json();
        });
    }
}
exports.default = IngredientController;
