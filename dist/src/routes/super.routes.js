"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Super_controller_1 = __importDefault(require("../controllers/Super.controller"));
const validateBody_middleware_1 = __importDefault(require("../middlewares/validateBody.middleware"));
const createSuperUser_schema_1 = __importDefault(require("../schemas/super/createSuperUser.schema"));
const superRoutes = (0, express_1.Router)();
superRoutes.post("/", (0, validateBody_middleware_1.default)(createSuperUser_schema_1.default), Super_controller_1.default.store);
exports.default = superRoutes;
