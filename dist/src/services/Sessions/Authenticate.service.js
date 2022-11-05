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
const Employee_model_1 = __importDefault(require("../../models/Employee.model"));
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthenticateService {
    static execute({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const employeeRepository = data_source_1.default.getRepository(Employee_model_1.default);
            const employee = yield employeeRepository.findOne({ where: { email } });
            if (!employee) {
                throw new AppError_1.default("Invalid email or password", 401);
            }
            const passwordMatch = yield (0, bcryptjs_1.compare)(password, employee.password);
            if (!passwordMatch) {
                throw new AppError_1.default("Invalid email or password", 401);
            }
            const token = jsonwebtoken_1.default.sign({ id: employee.id }, process.env.SECRET || "default", {
                expiresIn: "1d",
            });
            return token;
        });
    }
}
exports.default = AuthenticateService;
