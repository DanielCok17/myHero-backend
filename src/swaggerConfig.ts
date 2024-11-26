import { Options } from "swagger-jsdoc";

const swaggerOptions: Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "My Hero Backend API",
            version: "1.0.0",
            description: "API documentation for My Hero Backend",
        },
        servers: [
            {
                url: "http://localhost:4000/api",
            },
        ],
    },
    apis: ["./src/routes/*.ts"], // Path to the API docs in your routes
};

export default swaggerOptions;