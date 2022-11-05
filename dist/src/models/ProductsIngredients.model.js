"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const Ingredient_model_1 = __importDefault(require("./Ingredient.model"));
const Product_model_1 = __importDefault(require("./Product.model"));
let ProductIngredient = class ProductIngredient {
};
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], ProductIngredient.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ProductIngredient.prototype, "amount", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProductIngredient.prototype, "productId", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProductIngredient.prototype, "ingredientId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Ingredient_model_1.default, { eager: true }),
    __metadata("design:type", Ingredient_model_1.default)
], ProductIngredient.prototype, "ingredient", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product_model_1.default),
    __metadata("design:type", Product_model_1.default)
], ProductIngredient.prototype, "product", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ProductIngredient.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ProductIngredient.prototype, "updatedAt", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], ProductIngredient.prototype, "deletedAt", void 0);
ProductIngredient = __decorate([
    (0, typeorm_1.Entity)("products_ingredients")
], ProductIngredient);
exports.default = ProductIngredient;
