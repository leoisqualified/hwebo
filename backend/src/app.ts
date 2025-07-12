import express from "express";
import "reflect-metadata";
import { json } from "body-parser";
import healthRoutes from "./routes/health";
import authRoutes from "./routes/auth";
import { errorHandler } from "./middlewares/errorHandler";
import adminRoutes from "./routes/admin";
import supplierRoutes from "./routes/supplier";
import bidRequestRoutes from "./routes/bidRequests";
import supplierOfferRoutes from "./routes/supplierOffer";
import paymentRoutes from "./routes/payment";
import cors from "cors";
import path from "path";

const allowedOrigin = process.env.APP_FRONTEND_URL;

const app = express();

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true, // If using cookies or authorization headers
  })
);
app.use(json());

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bid-requests", bidRequestRoutes);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/api/supplier-offers", supplierOfferRoutes);
app.use("/api/payment", paymentRoutes);

// Global error handler
app.use(errorHandler);

export default app;
