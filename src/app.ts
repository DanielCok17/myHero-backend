import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import xss from "xss-clean";
import routes from "./routes";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerConfig from "./swaggerConfig";
import authRoutes from "./routes/authRoutes";
import { trafficLogger } from "./middleware/trafficLogger";

const createApp = (): Application => {
    const app = express();

    // Middleware
    app.use(trafficLogger);
    app.use(express.json()); // Parse JSON bodies
    app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
    app.use(cors()); // Enable Cross-Origin Resource Sharing
    app.use(helmet()); // Enhance API security
    app.use(morgan("dev")); // Log HTTP requests
    app.use(xss()); // Sanitize user input

    // Routes
    app.use("/api", routes);

    // Swagger setup
    const swaggerSpec = swaggerJsdoc(swaggerConfig);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use("/api/web", authRoutes);

    // 404 Not Found Handler
    app.use((_req, res, _next) => {
        res.status(404).json({ error: "Endpoint not found" });
    });

    // Error Handler
    app.use((err: any, _req: any, res: any, _next: any) => {
        console.error(err.stack);
        res.status(500).json({ error: "Something went wrong" });
    });

    return app;
};

export default createApp;