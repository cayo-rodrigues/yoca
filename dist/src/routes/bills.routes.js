"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Bills_controller_1 = __importDefault(require("../controllers/Bills.controller"));
const verifyAccessLevel_middleware_1 = __importDefault(require("../middlewares/verifyAccessLevel.middleware"));
const validateNumberId_middleware_1 = __importDefault(require("../middlewares/validateNumberId.middleware"));
const validateBody_middleware_1 = __importDefault(require("../middlewares/validateBody.middleware"));
const updateBill_schema_1 = __importDefault(require("../schemas/bills/updateBill.schema"));
const billsRoutes = (0, express_1.Router)();
billsRoutes.post("/", (0, verifyAccessLevel_middleware_1.default)(3), Bills_controller_1.default.store);
billsRoutes.get("/", (0, verifyAccessLevel_middleware_1.default)(3), Bills_controller_1.default.index);
billsRoutes.use("/:id", validateNumberId_middleware_1.default);
billsRoutes.get("/:id", (0, verifyAccessLevel_middleware_1.default)(3), Bills_controller_1.default.show);
billsRoutes.patch("/:id", (0, validateBody_middleware_1.default)(updateBill_schema_1.default), (0, verifyAccessLevel_middleware_1.default)(3), Bills_controller_1.default.update);
billsRoutes.delete("/:id", (0, verifyAccessLevel_middleware_1.default)(2), Bills_controller_1.default.delete);
exports.default = billsRoutes;
