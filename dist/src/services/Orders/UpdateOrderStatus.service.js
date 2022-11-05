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
const Order_model_1 = __importDefault(require("../../models/Order.model"));
class UpdateOrderStatusService {
    static execute({ status, id }) {
        return __awaiter(this, void 0, void 0, function* () {
            const ordersRepo = data_source_1.default.getRepository(Order_model_1.default);
            const order = yield ordersRepo.findOne({
                where: {
                    id,
                },
            });
            if (!order) {
                throw new AppError_1.default("Order not found", 404);
            }
            order.status = status;
            yield ordersRepo.save(order);
            return order;
        });
    }
}
exports.default = UpdateOrderStatusService;
