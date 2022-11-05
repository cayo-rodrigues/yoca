"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Sessions_controller_1 = __importDefault(require("../controllers/Sessions.controller"));
const validateBody_middleware_1 = __importDefault(require("../middlewares/validateBody.middleware"));
const validateLogin_schema_1 = __importDefault(require("../schemas/sessions/validateLogin.schema"));
const sessionsRoutes = (0, express_1.Router)();
sessionsRoutes.post("/", (0, validateBody_middleware_1.default)(validateLogin_schema_1.default), Sessions_controller_1.default.authenticate);
exports.default = sessionsRoutes;
