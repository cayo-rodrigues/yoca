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
const CreateEmployee_service_1 = __importDefault(require("../services/Employees/CreateEmployee.service"));
const DeleteEmployee_service_1 = __importDefault(require("../services/Employees/DeleteEmployee.service"));
const ListEmployees_service_1 = __importDefault(require("../services/Employees/ListEmployees.service"));
const ShowEmployee_service_1 = __importDefault(require("../services/Employees/ShowEmployee.service"));
const UpdateEmployee_service_1 = __importDefault(require("../services/Employees/UpdateEmployee.service"));
class EmployeesController {
    static store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { accessLevel, email, name, password, phone } = req.body;
            const employee = yield CreateEmployee_service_1.default.execute({
                accessLevel,
                email,
                name,
                password,
                phone,
            });
            res.status(201).json({
                message: "Employee created",
                employee: (0, class_transformer_1.instanceToPlain)(employee),
            });
        });
    }
    static index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const per_page = req.query.per_page;
            const page = req.query.page;
            const employees = yield ListEmployees_service_1.default.execute({
                per_page: +per_page,
                page: +page,
            });
            res.json((0, class_transformer_1.instanceToPlain)(employees));
        });
    }
    static show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const employee = yield ShowEmployee_service_1.default.execute({ id });
            res.json((0, class_transformer_1.instanceToPlain)(employee));
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const loggedUser = req.user;
            const { accessLevel, email, name, password, phone } = req.body;
            const employee = yield UpdateEmployee_service_1.default.execute({
                id,
                loggedUser,
                updateData: {
                    accessLevel,
                    email,
                    name,
                    password,
                    phone,
                },
            });
            res.json({
                message: "Employee updated",
                employee: (0, class_transformer_1.instanceToPlain)(employee),
            });
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield DeleteEmployee_service_1.default.execute({ id });
            res.status(204).json();
        });
    }
}
exports.default = EmployeesController;
