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
const CreateBill_service_1 = __importDefault(require("../services/Bills/CreateBill.service"));
const DeleteBill_service_1 = __importDefault(require("../services/Bills/DeleteBill.service"));
const ListBills_service_1 = __importDefault(require("../services/Bills/ListBills.service"));
const ShowBill_service_1 = __importDefault(require("../services/Bills/ShowBill.service"));
const UpdateBill_service_1 = __importDefault(require("../services/Bills/UpdateBill.service"));
class BillsController {
    static store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdBill = yield CreateBill_service_1.default.execute();
            return res
                .status(201)
                .json({ message: "Bill created", bill: (0, class_transformer_1.instanceToPlain)(createdBill) });
        });
    }
    static index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const listUnpaid = !!req.query.unpaid;
            const per_page = req.query.per_page;
            const page = req.query.page;
            const bills = yield ListBills_service_1.default.execute({
                listUnpaid,
                per_page: +per_page,
                page: +page,
            });
            return res.json((0, class_transformer_1.instanceToPlain)(bills));
        });
    }
    static show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const bill = yield ShowBill_service_1.default.execute({ id: +id });
            return res.json((0, class_transformer_1.instanceToPlain)(bill));
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { paid } = req.body;
            const updatedBill = yield UpdateBill_service_1.default.execute({ paid, id: +id });
            return res.json({
                message: "Bill updated",
                bill: (0, class_transformer_1.instanceToPlain)(updatedBill),
            });
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield DeleteBill_service_1.default.execute({ id: +id });
            return res.status(204).json();
        });
    }
}
exports.default = BillsController;
