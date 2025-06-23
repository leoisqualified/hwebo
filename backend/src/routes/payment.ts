// routes/paymentRoutes.ts
import { Router } from "express";
import { initiatePayment } from "../controllers/paymentController";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post("/", authenticate, initiatePayment);

export default router;
