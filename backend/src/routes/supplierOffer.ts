// routes/supplierOfferRoutes.ts
import { Router } from "express";
import {
  submitOffer,
  getOffersForBidItem,
  selectWinningOffer,
  getSchoolPayments,
  getAvailableBids,
} from "../controllers/supplierOfferController";
import { authenticate } from "../middlewares/authenticate";
import { validateRequest } from "../middlewares/validateRequest";
import { submitOfferSchema } from "../validations/supplierOffer";

const router = Router();

router.post("/", authenticate, validateRequest(submitOfferSchema), submitOffer);
router.get("/available-bids", authenticate, getAvailableBids);
router.get("/school-payments", authenticate, getSchoolPayments);
router.post("/select/:offerId", authenticate, selectWinningOffer);
router.get("/:bidItemId", authenticate, getOffersForBidItem);

export default router;
