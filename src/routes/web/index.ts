import { Router } from "express";
import paymentRoutes from "./paymentRoutes";
import profileRoutes from "./profileRoutes";

const webRouter = Router();

// Add routes for web API
webRouter.use("/payments", paymentRoutes);
webRouter.use("/profile", profileRoutes);

export default webRouter;