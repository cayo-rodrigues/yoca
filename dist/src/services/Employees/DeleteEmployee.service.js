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
const Employee_model_1 = __importDefault(require("../../models/Employee.model"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
class DeleteEmployeeService {
    static execute({ id }) {
        return __awaiter(this, void 0, void 0, function* () {
            const employeeRepository = data_source_1.default.getRepository(Employee_model_1.default);
            const employee = yield employeeRepository.findOne({ where: { id } });
            if (!employee) {
                throw new AppError_1.default("Employee with this id not found", 404);
            }
            if (employee.accessLevel === 1) {
                throw new AppError_1.default("Super user cannot be deleted", 405);
            }
            yield employeeRepository.softDelete(id);
        });
    }
}
exports.default = DeleteEmployeeService;
