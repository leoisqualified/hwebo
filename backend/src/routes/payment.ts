import express from "express";
import {
  initiatePayment,
  paystackWebhook,
  verifyPaymentStatus
} from "../controllers/paymentController";
import { authenticate } from "../middlewares/authenticate";

const router = express.Router();

router.post("/initiate", authenticate, initiatePayment);
router.post(
  "/paystack/webhook",
  express.raw({ type: "application/json" }),
  paystackWebhook
); // no JSON parsing
router.post("/verify", authenticate, verifyPaymentStatus);


export default router;
