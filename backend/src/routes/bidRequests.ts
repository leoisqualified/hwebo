// routes/bidRequestRoutes.ts
import { Router } from "express";
import {
  createBidRequest,
  getActiveBidRequests,
  getBidRequestById,
  getMyBids,
} from "../controllers/bidRequestController";
import { authenticate } from "../middlewares/authenticate";
import { validateRequest } from "../middlewares/validateRequest";
import { createBidRequestSchema } from "../validations/bidRequests";

const router = Router();

router.post(
  "/",
  authenticate,
  validateRequest(createBidRequestSchema),
  createBidRequest
);
router.get("/active", authenticate, getActiveBidRequests);
router.get("/:id", authenticate, getBidRequestById);
router.get("/my-bids", authenticate, getMyBids);

export default router;
