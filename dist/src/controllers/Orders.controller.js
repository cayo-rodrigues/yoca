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
const CreateOrder_service_1 = __importDefault(require("../services/Orders/CreateOrder.service"));
const DeleteOrder_service_1 = __importDefault(require("../services/Orders/DeleteOrder.service"));
const ListMyOrders_service_1 = __importDefault(require("../services/Orders/ListMyOrders.service"));
const ListOrders_service_1 = __importDefault(require("../services/Orders/ListOrders.service"));
const listPendingOrders_service_1 = __importDefault(require("../services/Orders/listPendingOrders.service"));
const listReadyOrders_service_1 = __importDefault(require("../services/Orders/listReadyOrders.service"));
const ShowOrder_service_1 = __importDefault(require("../services/Orders/ShowOrder.service"));
const UpdateOrderStatus_service_1 = __importDefault(require("../services/Orders/UpdateOrderStatus.service"));
class OrdersController {
    static store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { billId, employeeId, ordersProducts, table } = req.body;
            const { isWarning, lowStockIngredients, order } = yield CreateOrder_service_1.default.execute({
                billId,
                employeeId,
                ordersProducts,
                table,
            });
            return res.status(201).json(isWarning
                ? {
                    warning: lowStockIngredients.join(" is below amount min, ") +
                        " is below amount min",
                    message: "Order created",
                    order: (0, class_transformer_1.instanceToPlain)(order),
                }
                : {
                    message: "Order created",
                    order: (0, class_transformer_1.instanceToPlain)(order),
                });
        });
    }
    static index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const per_page = req.query.per_page;
            const page = req.query.page;
            const orders = yield ListOrders_service_1.default.execute({
                per_page: +per_page,
                page: +page,
            });
            return res.json((0, class_transformer_1.instanceToPlain)(orders));
        });
    }
    static show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const order = yield ShowOrder_service_1.default.execute({ id });
            return res.json((0, class_transformer_1.instanceToPlain)(order));
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status } = req.body;
            const { id } = req.params;
            const orderUpdated = yield UpdateOrderStatus_service_1.default.execute({ status, id });
            return res.status(201).json({
                message: "Order status updated",
                order: (0, class_transformer_1.instanceToPlain)(orderUpdated),
            });
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield DeleteOrder_service_1.default.execute({ id });
            res.status(204).json();
        });
    }
    static my(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const per_page = req.query.per_page;
            const page = req.query.page;
            const { id } = req.user;
            const orders = yield ListMyOrders_service_1.default.execute({
                id,
                per_page: +per_page,
                page: +page,
            });
            return res.json((0, class_transformer_1.instanceToPlain)(orders));
        });
    }
    static pending(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const per_page = req.query.per_page;
            const page = req.query.page;
            const orders = yield listPendingOrders_service_1.default.execute({
                per_page: +per_page,
                page: +page,
            });
            return res.json((0, class_transformer_1.instanceToPlain)(orders));
        });
    }
    static ready(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const per_page = req.query.per_page;
            const page = req.query.page;
            const orders = yield listReadyOrders_service_1.default.execute({
                per_page: +per_page,
                page: +page,
            });
            return res.json((0, class_transformer_1.instanceToPlain)(orders));
        });
    }
}
exports.default = OrdersController;
