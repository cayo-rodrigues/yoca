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
const CreateFeedback_service_1 = __importDefault(require("../services/GeneralFeedbacks/CreateFeedback.service"));
const DeleteGeneralFeedback_service_1 = __importDefault(require("../services/GeneralFeedbacks/DeleteGeneralFeedback.service"));
const ListGeneralFeedbacks_service_1 = __importDefault(require("../services/GeneralFeedbacks/ListGeneralFeedbacks.service"));
const ShowGeneralFeedback_service_1 = __importDefault(require("../services/GeneralFeedbacks/ShowGeneralFeedback.service"));
class GeneralFeedbackController {
    static store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { description, rating } = req.body;
            const newFeedback = yield CreateFeedback_service_1.default.execute({
                description,
                rating,
            });
            return res.status(201).json({
                message: "General feedback created",
                feedback: (0, class_transformer_1.instanceToPlain)(newFeedback),
            });
        });
    }
    static index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const per_page = req.query.per_page;
            const page = req.query.page;
            const feedbacks = yield ListGeneralFeedbacks_service_1.default.execute({
                per_page: +per_page,
                page: +page,
            });
            return res.json((0, class_transformer_1.instanceToPlain)(feedbacks));
        });
    }
    static show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const feedback = yield ShowGeneralFeedback_service_1.default.execute({ id });
            return res.json((0, class_transformer_1.instanceToPlain)(feedback));
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield DeleteGeneralFeedback_service_1.default.execute({ id });
            return res.status(204).json();
        });
    }
}
exports.default = GeneralFeedbackController;
