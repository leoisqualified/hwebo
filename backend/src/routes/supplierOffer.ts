// routes/supplierOfferRoutes.ts
import { Router } from "express";
import {
  submitOffer,
  getOffersForBidItem,
  selectWinningOffer,
  getSchoolPayments,
} from "../controllers/supplierOfferController";
import { authenticate } from "../middlewares/authenticate";
import { validateRequest } from "../middlewares/validateRequest";
import { submitOfferSchema } from "../validations/supplierOffer";

const router = Router();

router.post("/", authenticate, validateRequest(submitOfferSchema), submitOffer);
router.get("/:bidItemId", authenticate, getOffersForBidItem);
router.post("/select/:offerId", authenticate, selectWinningOffer);
router.get("/school-payments", authenticate, getSchoolPayments);

export default router;
