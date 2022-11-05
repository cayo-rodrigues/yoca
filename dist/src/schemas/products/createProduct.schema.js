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
const createProductSchema = yup.object().shape({
    name: yup
        .string()
        .max(164, "Field name cannot be longer than 164 characters")
        .required("Field name is required")
        .transform(utils_1.normalizeTextInput),
    price: yup
        .number()
        .positive("Field price must be a positive number")
        .max(utils_1.MAX_DECIMAL, "Field amount cannot be longer than 10 characters (including decimal places)")
        .required("Field price is required")
        .transform(utils_1.roundToTwo),
    calories: yup
        .number()
        .positive("Field calories must be a positive number")
        .required("Field calories is required")
        .transform(utils_1.roundToTwo),
    ingredients: yup
        .array()
        .of(yup.object().shape({
        id: yup
            .string()
            .uuid("Field ingredient id must have a valid UUID")
            .required("Field ingredient id is required"),
        amount: yup
            .number()
            .positive("Field amount must be a positive number")
            .required("Field amount is required"),
    }))
        .required("Field ingredients is required"),
    categories: yup
        .array()
        .of(yup.string().uuid("Field categories must be a valid array of UUID"))
        .required("Field categories is required"),
});
exports.default = createProductSchema;
