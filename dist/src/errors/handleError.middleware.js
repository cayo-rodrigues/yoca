"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("./AppError"));
require("express-async-errors");
const errorHandler = (err, req, res, _) => {
    if (err instanceof AppError_1.default) {
        return res.status(err.statusCode).json({
            message: err.message,
        });
    }
    console.log(err);
    return res.status(500).json({
        message: "Internal server error, please try again later",
    });
};
exports.default = errorHandler;
