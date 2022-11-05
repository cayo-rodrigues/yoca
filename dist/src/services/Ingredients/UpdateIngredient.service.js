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
const Ingredient_model_1 = __importDefault(require("../../models/Ingredient.model"));
class UpdateIngredientService {
    static execute({ id, amount, amountMax, amountMin, measure, name, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const ingredientRepo = data_source_1.default.getRepository(Ingredient_model_1.default);
            if (name) {
                const ingredientAlreadyExists = yield ingredientRepo.findOne({
                    where: { name, id: (0, typeorm_1.Not)(id) },
                });
                if (ingredientAlreadyExists) {
                    throw new AppError_1.default("Ingredient already exists, add to its amount instead", 409);
                }
            }
            const updatedIngredient = yield ingredientRepo
                .createQueryBuilder()
                .update(Ingredient_model_1.default, { amount, amountMax, amountMin, measure, name })
                .where("id = :id", { id })
                .returning("*")
                .execute()
                .then(({ raw }) => raw[0]);
            if (!updatedIngredient) {
                throw new AppError_1.default("Ingredient not found", 404);
            }
            return updatedIngredient;
        });
    }
}
exports.default = UpdateIngredientService;
