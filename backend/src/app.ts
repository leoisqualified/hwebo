import express from "express";
import "reflect-metadata";
import { json } from "body-parser";
import { env } from "./config";
import healthRoutes from "./routes/health";
import authRoutes from "./routes/auth";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(json());

// Routes
app.use("/health", healthRoutes);
app.use("/auth", authRoutes);

// ...

// Global error handler
app.use(errorHandler);

export default app;
