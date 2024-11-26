"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mobile_1 = __importDefault(require("./mobile"));
const web_1 = __importDefault(require("./web"));
const router = (0, express_1.Router)();
// Group mobile routes under `/mobile`
router.use("/mobile", mobile_1.default);
// Group web routes under `/web`
router.use("/web", web_1.default);
exports.default = router;
