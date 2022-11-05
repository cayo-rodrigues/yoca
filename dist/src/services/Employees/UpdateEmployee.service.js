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
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
class UpdateEmployeeService {
    static execute({ id, updateData, loggedUser, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const employeeRepository = data_source_1.default.getRepository(Employee_model_1.default);
            const employee = yield employeeRepository.findOne({ where: { id } });
            if (!employee) {
                throw new AppError_1.default("Employee with this id not found", 404);
            }
            if (employee.accessLevel === 1 && loggedUser.accessLevel !== 1) {
                throw new AppError_1.default("You need access level 1 to update super user", 401);
            }
            const { phone, email } = updateData;
            const emailOrPhoneAlreadyExists = yield employeeRepository.findOne({
                where: [
                    { phone, id: (0, typeorm_1.Not)(id) },
                    { email, id: (0, typeorm_1.Not)(id) },
                ],
                withDeleted: true,
            });
            if (emailOrPhoneAlreadyExists) {
                if (emailOrPhoneAlreadyExists.email === email) {
                    throw new AppError_1.default("Employee with this email already exists", 409);
                }
                if (emailOrPhoneAlreadyExists.phone === phone) {
                    throw new AppError_1.default("Employee with this phone already exists", 409);
                }
            }
            employee.name = updateData.name ? updateData.name : employee.name;
            employee.email = updateData.email ? updateData.email : employee.email;
            employee.phone = updateData.phone ? updateData.phone : employee.phone;
            if (updateData.password) {
                employee.password = yield (0, bcryptjs_1.hash)(updateData.password, 8);
            }
            const updatedEmployee = yield employeeRepository.save(employee);
            const employeeWithoutPassword = (0, class_transformer_1.plainToInstance)(Employee_model_1.default, updatedEmployee);
            return employeeWithoutPassword;
        });
    }
}
exports.default = UpdateEmployeeService;
