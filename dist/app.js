"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const routes_1 = __importDefault(require("./routes"));
const createApp = () => {
    const app = (0, express_1.default)();
    // Middleware
    app.use(express_1.default.json()); // Parse JSON bodies
    app.use(express_1.default.urlencoded({ extended: true })); // Parse URL-encoded bodies
    app.use((0, cors_1.default)()); // Enable Cross-Origin Resource Sharing
    app.use((0, helmet_1.default)()); // Enhance API security
    app.use((0, morgan_1.default)("dev")); // Log HTTP requests
    // Routes
    app.use("/api", routes_1.default);
    // 404 Not Found Handler
    app.use((_req, res, _next) => {
        res.status(404).json({ error: "Endpoint not found" });
    });
    // Error Handler
    app.use((err, _req, res, _next) => {
        console.error(err.stack);
        res.status(500).json({ error: "Something went wrong" });
    });
    return app;
};
exports.default = createApp;
