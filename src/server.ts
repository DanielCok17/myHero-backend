import dotenv from "dotenv";
import createApp from "./app";
import { connectToDatabase } from "./config/database";

// Load environment variables
dotenv.config();

// Create the application
const app = createApp();

// Get the port from environment variables or use a default
const PORT = process.env.PORT || 4000;

// Start the server after connecting to the database
const startServer = async () => {
    try {
        // Connect to the database
        await connectToDatabase();
        console.log("Database connected successfully.");

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start the server:", error);
        process.exit(1); // Exit with failure
    }
};

startServer();