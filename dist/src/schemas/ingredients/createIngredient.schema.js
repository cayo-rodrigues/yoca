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
const createIngredientSchema = yup.object().shape({
    name: yup
        .string()
        .max(164, "Field name cannot be longer than 164 characters")
        .required("Field name is required")
        .transform((value) => (0, utils_1.normalizeTextInput)(value)),
    measure: yup
        .string()
        .max(3, "Field measure cannot be longer than 3 characters")
        .required("Field measure is required")
        .transform((value) => (0, utils_1.normalizeTextInput)(value)),
    amount: yup
        .number()
        .max(utils_1.MAX_DECIMAL, "Field amount cannot be longer than 10 characters (including decimal places)")
        .positive("Field amount must be a positive number")
        .required("Field amount is required")
        .transform((value) => (0, utils_1.roundToTwo)(value)),
    amountMax: yup
        .number()
        .max(utils_1.MAX_DECIMAL, "Field amountMax cannot be longer than 10 characters (including decimal places)")
        .positive("Field amountMax must be a positive number")
        .required("Field amountMax is required")
        .transform((value) => (0, utils_1.roundToTwo)(value)),
    amountMin: yup
        .number()
        .max(utils_1.MAX_DECIMAL, "Field amountMin cannot be longer than 10 characters (including decimal places)")
        .positive("Field amountMin must be a positive number")
        .required("Field amountMin is required")
        .lessThan(yup.ref("amountMax"), "Field amountMin should be smaller than field amountMax")
        .transform((value) => (0, utils_1.roundToTwo)(value)),
});
exports.default = createIngredientSchema;
