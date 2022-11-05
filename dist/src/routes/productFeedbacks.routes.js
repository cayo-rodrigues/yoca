"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductFeedbacks_controller_1 = __importDefault(require("../controllers/ProductFeedbacks.controller"));
const ensureAuth_middleware_1 = __importDefault(require("../middlewares/ensureAuth.middleware"));
const validateBody_middleware_1 = __importDefault(require("../middlewares/validateBody.middleware"));
const validateUUID_middleware_1 = __importDefault(require("../middlewares/validateUUID.middleware"));
const verifyAccessLevel_middleware_1 = __importDefault(require("../middlewares/verifyAccessLevel.middleware"));
const createProductFeedback_schema_1 = __importDefault(require("../schemas/productFeedback/createProductFeedback.schema"));
const productFeedbackRoutes = (0, express_1.Router)();
productFeedbackRoutes.post("/", (0, validateBody_middleware_1.default)(createProductFeedback_schema_1.default), ProductFeedbacks_controller_1.default.store);
productFeedbackRoutes.get("/", ProductFeedbacks_controller_1.default.index);
productFeedbackRoutes.use("/:id", validateUUID_middleware_1.default);
productFeedbackRoutes.get("/:id", ProductFeedbacks_controller_1.default.show);
productFeedbackRoutes.delete("/:id", ensureAuth_middleware_1.default, (0, verifyAccessLevel_middleware_1.default)(2), ProductFeedbacks_controller_1.default.delete);
exports.default = productFeedbackRoutes;
