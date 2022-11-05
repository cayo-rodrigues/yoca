"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GeneralFeedbacks_controller_1 = __importDefault(require("../controllers/GeneralFeedbacks.controller"));
const ensureAuth_middleware_1 = __importDefault(require("../middlewares/ensureAuth.middleware"));
const validateBody_middleware_1 = __importDefault(require("../middlewares/validateBody.middleware"));
const validateUUID_middleware_1 = __importDefault(require("../middlewares/validateUUID.middleware"));
const verifyAccessLevel_middleware_1 = __importDefault(require("../middlewares/verifyAccessLevel.middleware"));
const createGeneralFeedback_schema_1 = __importDefault(require("../schemas/generalFeedback/createGeneralFeedback.schema"));
const generalFeedbackRoutes = (0, express_1.Router)();
generalFeedbackRoutes.post("/", (0, validateBody_middleware_1.default)(createGeneralFeedback_schema_1.default), GeneralFeedbacks_controller_1.default.store);
generalFeedbackRoutes.get("/", GeneralFeedbacks_controller_1.default.index);
generalFeedbackRoutes.use("/:id", validateUUID_middleware_1.default);
generalFeedbackRoutes.get("/:id", GeneralFeedbacks_controller_1.default.show);
generalFeedbackRoutes.delete("/:id", ensureAuth_middleware_1.default, (0, verifyAccessLevel_middleware_1.default)(2), GeneralFeedbacks_controller_1.default.delete);
exports.default = generalFeedbackRoutes;
