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
const Bill_model_1 = __importDefault(require("../../models/Bill.model"));
const Employee_model_1 = __importDefault(require("../../models/Employee.model"));
const Ingredient_model_1 = __importDefault(require("../../models/Ingredient.model"));
const Order_model_1 = __importDefault(require("../../models/Order.model"));
const OrdersProducts_model_1 = __importDefault(require("../../models/OrdersProducts.model"));
const Product_model_1 = __importDefault(require("../../models/Product.model"));
class CreateOrderService {
    static execute({ ordersProducts, table, employeeId, billId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderRepo = data_source_1.default.getRepository(Order_model_1.default);
            const productsRepo = data_source_1.default.getRepository(Product_model_1.default);
            const employeeRepo = data_source_1.default.getRepository(Employee_model_1.default);
            const orderProductRepo = data_source_1.default.getRepository(OrdersProducts_model_1.default);
            const billsRepo = data_source_1.default.getRepository(Bill_model_1.default);
            const ingredientsRepo = data_source_1.default.getRepository(Ingredient_model_1.default);
            const employee = yield employeeRepo.findOneBy({
                id: employeeId,
            });
            if (!employee) {
                throw new AppError_1.default("Employee not found", 404);
            }
            const bill = yield billsRepo.findOneBy({
                id: billId,
            });
            if (!bill) {
                throw new AppError_1.default("Bill not found", 404);
            }
            if (bill.paid) {
                throw new AppError_1.default("Bill is already paid", 400);
            }
            const productsIds = ordersProducts.map(({ productId }) => productId);
            const toFindDuplicates = productsIds.filter((item, index) => productsIds.indexOf(item) !== index);
            if (toFindDuplicates.length > 0) {
                throw new AppError_1.default("Duplicate products id", 400);
            }
            const products = yield productsRepo.findBy({
                id: (0, typeorm_1.In)(productsIds),
            });
            if (products.length !== productsIds.length) {
                throw new AppError_1.default("Invalid list of ids", 400);
            }
            const productsIngredientsInfo = products.map((product) => {
                return product.ingredients.map((productIngredient) => {
                    return {
                        ingredientId: productIngredient.ingredientId,
                        amount: productIngredient.amount,
                    };
                });
            });
            const ingredientsAcc = [];
            productsIngredientsInfo.flat().forEach((current) => {
                const idx = ingredientsAcc.findIndex((ingredient) => ingredient.ingredientId === current.ingredientId);
                if (idx === -1) {
                    ingredientsAcc.push(current);
                }
                else {
                    ingredientsAcc[idx].amount =
                        +current.amount + +ingredientsAcc[idx].amount;
                }
            });
            const productsingredients = yield ingredientsRepo.findBy({
                id: (0, typeorm_1.In)(ingredientsAcc.map(({ ingredientId }) => ingredientId)),
            });
            for (let i = 0; i < ingredientsAcc.length; i++) {
                const ingredientInfo = ingredientsAcc[i];
                const ingredient = productsingredients[i];
                for (let j = 0; j < ordersProducts.length; j++) {
                    const orderProduct = ordersProducts[j];
                    if (ingredient.amount < ingredientInfo.amount * orderProduct.quantity) {
                        throw new AppError_1.default("Insufficient stock for this order", 400);
                    }
                }
            }
            let isWarning = false;
            const lowStockIngredients = [];
            for (let i = 0; i < ingredientsAcc.length; i++) {
                const ingredientInfo = ingredientsAcc[i];
                const ingredient = productsingredients[i];
                for (let j = 0; j < ordersProducts.length; j++) {
                    const orderProduct = ordersProducts[j];
                    ingredient.amount =
                        +ingredient.amount - ingredientInfo.amount * orderProduct.quantity;
                    if (ingredient.amount <= +ingredient.amountMin) {
                        isWarning = true;
                        lowStockIngredients.push(ingredient.name);
                    }
                }
            }
            ingredientsRepo.save(productsingredients);
            const orderTotalPrice = products.reduce((acc, curr, idx) => acc + curr.price * ordersProducts[idx].quantity, 0);
            bill.total = +bill.total + orderTotalPrice;
            yield billsRepo.save(bill);
            const order = orderRepo.create({
                table,
                employeeId,
                billId,
                total: orderTotalPrice,
                status: "pending",
            });
            yield orderRepo.save(order);
            ordersProducts.forEach(({ productId, quantity }, index) => __awaiter(this, void 0, void 0, function* () {
                const orderProduct = orderProductRepo.create({
                    orderId: order.id,
                    productId,
                    totalPrice: products[index].price * quantity,
                    quantity,
                });
                yield orderProductRepo.save(orderProduct);
            }));
            return { isWarning, order, lowStockIngredients };
        });
    }
}
exports.default = CreateOrderService;
