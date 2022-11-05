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
const typeorm_1 = require("typeorm");
const ProductFeedback_model_1 = __importDefault(require("./ProductFeedback.model"));
const ProductsIngredients_model_1 = __importDefault(require("./ProductsIngredients.model"));
const ProductCategory_model_1 = __importDefault(require("./ProductCategory.model"));
let Product = class Product {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Product.prototype, "calories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProductsIngredients_model_1.default, (ProductIngredient) => ProductIngredient.product, { eager: true }),
    __metadata("design:type", Array)
], Product.prototype, "ingredients", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProductCategory_model_1.default, (ProductCategory) => ProductCategory.product, { eager: true }),
    __metadata("design:type", Array)
], Product.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProductFeedback_model_1.default, (feedback) => feedback.product, {
        eager: true,
    }),
    __metadata("design:type", Array)
], Product.prototype, "feedbacks", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
Product = __decorate([
    (0, typeorm_1.Entity)("products")
], Product);
exports.default = Product;
