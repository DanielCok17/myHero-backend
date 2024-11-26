"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentRoutes_1 = __importDefault(require("./paymentRoutes"));
const profileRoutes_1 = __importDefault(require("./profileRoutes"));
const webRouter = (0, express_1.Router)();
// Add routes for web API
webRouter.use("/payments", paymentRoutes_1.default);
webRouter.use("/profile", profileRoutes_1.default);
exports.default = webRouter;
