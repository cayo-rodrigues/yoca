"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const yup = __importStar(require("yup"));
const utils_1 = require("../../utils");
const createEmployeeSchema = yup.object().shape({
    name: yup
        .string()
        .max(164, "Field name cannot be longer than 164 characters")
        .required("Field name is required")
        .transform((value) => (0, utils_1.normalizeTextInput)(value)),
    phone: yup
        .string()
        .min(11, "Field phone cannot be shorter than 11 characters")
        .max(15, "Field phone cannot be longer than 15 characters")
        .required("Field phone is required"),
    email: yup
        .string()
        .email("Field email is invalid")
        .max(164, "Field email cannot be longer than 164 characters")
        .required("Field email is required")
        .transform((value) => (0, utils_1.normalizeTextInput)(value)),
    password: yup
        .string()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$&*]{8,}$/, "Field password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number")
        .required("Field password is required"),
    accessLevel: yup
        .number()
        .min(2, "Field accessLevel must be between 2 and 5 inclusive")
        .max(5, "Field accessLevel must be between 2 and 5 inclusive")
        .required("Field accessLevel is required"),
});
exports.default = createEmployeeSchema;
