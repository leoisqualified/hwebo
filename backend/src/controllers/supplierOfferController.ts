// controllers/supplierOfferController.ts
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/db";
import { SupplierOffer } from "../models/SupplierOffer";
import { BidItem } from "../models/BidItem";
import { User } from "../models/User";

const offerRepo = AppDataSource.getRepository(SupplierOffer);
const bidItemRepo = AppDataSource.getRepository(BidItem);
const userRepo = AppDataSource.getRepository(User);

export const submitOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { bidItemId, pricePerUnit, notes } = req.body;

    const userId = (req as any).user.userId;
    const user = await userRepo.findOneByOrFail({ id: userId });

    if (user.role !== "supplier") {
      res.status(403).json({ error: "Only suppliers can submit offers." });
    }

    const bidItem = await bidItemRepo.findOneByOrFail({ id: bidItemId });

    const offer = offerRepo.create({
      supplier: user,
      bidItem,
      pricePerUnit,
      notes,
    });

    await offerRepo.save(offer);

    res.status(201).json({ message: "Offer submitted successfully.", offer });
  } catch (error) {
    next(error);
  }
};

export const getOffersForBidItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bidItemId } = req.params;

    const offers = await offerRepo.find({
      where: { bidItem: { id: bidItemId } },
      relations: ["supplier"],
      order: { createdAt: "ASC" },
    });

    res.json({ offers });
  } catch (error) {
    next(error);
  }
};

export const selectWinningOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { offerId } = req.params;
    const userId = (req as any).user.userId;

    const offer = await offerRepo.findOne({
      where: { id: offerId },
      relations: ["bidItem", "bidItem.bidRequest", "bidItem.bidRequest.school"],
    });

    if (!offer) {
      res.status(404).json({ message: "Offer not found." });
      return;
    }

    // Make sure the school owns this bid request
    if (offer.bidItem.bidRequest.school.id !== userId) {
      res.status(403).json({ message: "Unauthorized" });
    }

    // Check if the deadline has passed
    if (new Date() < offer.bidItem.bidRequest.deadline) {
      res.status(400).json({ message: "Cannot select offer before deadline." });
    }

    // Reject all other offers for this item
    await offerRepo
      .createQueryBuilder()
      .update(SupplierOffer)
      .set({ status: "rejected" })
      .where("bidItemId = :bidItemId AND id != :offerId", {
        bidItemId: offer.bidItem.id,
        offerId: offer.id,
      })
      .execute();

    // Accept the selected offer
    offer.status = "accepted";
    await offerRepo.save(offer);

    res.status(200).json({ message: "Offer selected successfully." });
  } catch (error) {
    next(error);
  }
};

// Get all awarded offers for the logged-in school
export const getSchoolPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.userId;

    const awardedOffers = await offerRepo.find({
      where: {
        bidItem: {
          bidRequest: { school: { id: userId } },
        },
        status: "accepted",
      },
      relations: ["supplier", "bidItem", "bidItem.bidRequest"],
      order: { createdAt: "DESC" },
    });

    res.json({ awardedOffers });
  } catch (error) {
    next(error);
  }
};
