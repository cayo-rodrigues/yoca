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
const Employee_model_1 = __importDefault(require("./Employee.model"));
const Bill_model_1 = __importDefault(require("./Bill.model"));
const OrdersProducts_model_1 = __importDefault(require("./OrdersProducts.model"));
const class_transformer_1 = require("class-transformer");
let Order = class Order {
    getProducts() {
        var _a;
        return (_a = this.orderProducts) === null || _a === void 0 ? void 0 : _a.map(({ quantity, totalPrice, product }) => ({
            quantity,
            totalPrice,
            product,
        }));
    }
    showEmployee() {
        return (this.employee && {
            id: this.employee.id,
            name: this.employee.name,
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Order.prototype, "table", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Order.prototype, "total", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Order.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Employee_model_1.default, { eager: true }),
    __metadata("design:type", Employee_model_1.default)
], Order.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Order.prototype, "billId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Bill_model_1.default),
    __metadata("design:type", Bill_model_1.default)
], Order.prototype, "bill", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.OneToMany)(() => OrdersProducts_model_1.default, (orderProduct) => orderProduct.order, {
        eager: true,
    }),
    __metadata("design:type", Array)
], Order.prototype, "orderProducts", void 0);
__decorate([
    (0, class_transformer_1.Expose)({ name: "products" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], Order.prototype, "getProducts", null);
__decorate([
    (0, class_transformer_1.Expose)({ name: "employee" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], Order.prototype, "showEmployee", null);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "updatedAt", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "deletedAt", void 0);
Order = __decorate([
    (0, typeorm_1.Entity)("orders")
], Order);
exports.default = Order;
