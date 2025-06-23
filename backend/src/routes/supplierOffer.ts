// routes/supplierOfferRoutes.ts
import { Router } from "express";
import {
  submitOffer,
  getOffersForBidItem,
  selectWinningOffer,
} from "../controllers/supplierOfferController";
import { authenticate } from "../middlewares/authenticate";
import { validateRequest } from "../middlewares/validateRequest";
import { submitOfferSchema } from "../validations/supplierOffer";

const router = Router();

router.post("/", authenticate, validateRequest(submitOfferSchema), submitOffer);
router.get("/:bidItemId", authenticate, getOffersForBidItem);
router.post("/select/:offerId", authenticate, selectWinningOffer);

export default router;
