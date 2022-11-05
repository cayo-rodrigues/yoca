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
const AppError_1 = __importDefault(require("../errors/AppError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const data_source_1 = __importDefault(require("../data-source"));
const Employee_model_1 = __importDefault(require("../models/Employee.model"));
const ensureAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            throw new AppError_1.default("Missing authorization headers", 401);
        }
        const token = authorization.split(" ")[1];
        if (!token) {
            throw new AppError_1.default("Missing authorization token", 401);
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET || "default");
        const { id } = decoded;
        const employeeRepository = data_source_1.default.getRepository(Employee_model_1.default);
        const loggedInUser = yield employeeRepository.findOne({
            where: { id },
        });
        if (!loggedInUser) {
            throw new AppError_1.default("Unauthorized", 401);
        }
        req.user = loggedInUser;
        next();
    }
    catch (err) {
        if (err instanceof AppError_1.default) {
            throw new AppError_1.default(err.message, 401);
        }
        throw new AppError_1.default("Unauthorized", 401);
    }
});
exports.default = ensureAuthMiddleware;
