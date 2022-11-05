"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../errors/AppError"));
const verifyAccessLevelMiddleware = (accessLevels) => (req, res, next) => {
    const loggedInUser = req.user;
    if ((Array.isArray(accessLevels) &&
        accessLevels.includes(loggedInUser.accessLevel)) ||
        loggedInUser.accessLevel <= accessLevels) {
        next();
    }
    else {
        throw new AppError_1.default("Unauthorized", 401);
    }
};
exports.default = verifyAccessLevelMiddleware;
