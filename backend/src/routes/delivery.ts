import express from "express";
import { authenticate } from "../middlewares/authenticate";
import {
  startDelivery,
  completeDelivery,
  confirmDelivery,
} from "../controllers/deliveryController";

const router = express.Router();

// routes/deliveryRoutes.ts
router.post("/start", authenticate, startDelivery);
router.post("/complete", authenticate, completeDelivery);
router.post("/confirm", authenticate, confirmDelivery);

export default router;
