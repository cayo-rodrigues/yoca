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
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Ingredient_model_1 = __importDefault(require("../../models/Ingredient.model"));
class DeleteIngredientService {
    static execute({ id }) {
        return __awaiter(this, void 0, void 0, function* () {
            const ingredientRepo = data_source_1.default.getRepository(Ingredient_model_1.default);
            const ingredientExists = yield ingredientRepo.findOne({ where: { id } });
            if (!ingredientExists) {
                throw new AppError_1.default("Ingredient not found", 404);
            }
            yield ingredientRepo.delete({ id });
        });
    }
}
exports.default = DeleteIngredientService;
