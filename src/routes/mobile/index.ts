import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";

const mobileRouter = Router();

// Add routes for mobile API
mobileRouter.use("/users", userRoutes);
mobileRouter.use("/auth", authRoutes);

export default mobileRouter;