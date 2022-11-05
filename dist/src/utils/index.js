"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrl = exports.TESTS_PASSWORD = exports.MAX_BIGINT = exports.MAX_INT = exports.MAX_DECIMAL = exports.normalizeTextInput = exports.roundToTwo = void 0;
const roundToTwo = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
exports.roundToTwo = roundToTwo;
const normalizeTextInput = (s) => s.toLowerCase().trim();
exports.normalizeTextInput = normalizeTextInput;
exports.MAX_DECIMAL = 99999999.99;
exports.MAX_INT = 2147483647;
exports.MAX_BIGINT = 9223372036854775807;
exports.TESTS_PASSWORD = "S3nh@F0rt3";
const getUrl = () => process.env.NODE_ENV === "production"
    ? "https://cayoca.herokuapp.com"
    : `http://localhost:${process.env.PORT || 3000}`;
exports.getUrl = getUrl;
