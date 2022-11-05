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
const bcryptjs_1 = require("bcryptjs");
const class_transformer_1 = require("class-transformer");
const data_source_1 = __importDefault(require("../../data-source"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Employee_model_1 = __importDefault(require("../../models/Employee.model"));
class CreateSuperService {
    static execute({ phone, name, email, password, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const employeeRepository = data_source_1.default.getRepository(Employee_model_1.default);
            const users = yield employeeRepository.find();
            if (users.length > 0) {
                throw new AppError_1.default("Super user has to be created before other users", 409);
            }
            const superUser = employeeRepository.create({
                phone,
                name,
                email,
                password: yield (0, bcryptjs_1.hash)(password, 8),
                accessLevel: 1,
            });
            yield employeeRepository.save(superUser);
            const superUserWithoutPassword = (0, class_transformer_1.instanceToInstance)(superUser);
            return superUserWithoutPassword;
        });
    }
}
exports.default = CreateSuperService;
