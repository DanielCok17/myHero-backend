"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes_1 = __importDefault(require("./userRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const mobileRouter = (0, express_1.Router)();
// Add routes for mobile API
mobileRouter.use("/users", userRoutes_1.default);
mobileRouter.use("/auth", authRoutes_1.default);
exports.default = mobileRouter;
