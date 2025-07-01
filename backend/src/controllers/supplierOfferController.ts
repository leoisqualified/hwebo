// controllers/supplierOfferController.ts
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/db";
import { SupplierOffer } from "../models/SupplierOffer";
import { BidItem } from "../models/BidItem";
import { User } from "../models/User";
import { MoreThan } from "typeorm";
import { BidRequest } from "../models/BidRequest";

const offerRepo = AppDataSource.getRepository(SupplierOffer);
const bidItemRepo = AppDataSource.getRepository(BidItem);
const userRepo = AppDataSource.getRepository(User);
const bidRequestRepo = AppDataSource.getRepository(BidRequest);

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
      return;
    }

    const bidItem = await bidItemRepo.findOne({
      where: { id: bidItemId },
      relations: ["bidRequest"],
    });

    if (!bidItem) {
      res.status(404).json({ error: "Bid item not found." });
      return;
    }

    // Check if bid request is still open
    if (new Date(bidItem.bidRequest.deadline) < new Date()) {
      res
        .status(400)
        .json({ error: "Cannot submit offer. Deadline has passed." });
      return;
    }

    // Optional: Prevent duplicate offers from the same supplier on the same item
    const existingOffer = await offerRepo.findOne({
      where: {
        supplier: { id: userId },
        bidItem: { id: bidItemId },
      },
    });

    if (existingOffer) {
      res
        .status(400)
        .json({ error: "You have already submitted an offer for this item." });
      return;
    }

    const offer = offerRepo.create({
      supplier: user,
      bidItem,
      pricePerUnit,
      notes,
      status: "pending", // optional: you can add initial status
    });

    await offerRepo.save(offer);

    res.status(201).json({
      message: "Offer submitted successfully.",
      offer,
    });
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

export const getAvailableBids = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("GET /supplier-offers/available-bids called");

  try {
    const bidRequests = await bidRequestRepo
      .createQueryBuilder("bidRequest")
      .leftJoinAndSelect("bidRequest.school", "school")
      .leftJoinAndSelect("bidRequest.items", "items")
      .where("bidRequest.deadline > :now", { now: new Date() })
      .orderBy("bidRequest.deadline", "ASC")
      .getMany();

    console.log("Raw bidRequests from DB:", bidRequests);

    const formattedBids = bidRequests.map((bidRequest) => ({
      bidRequestId: bidRequest.id,
      title: bidRequest.title,
      description: bidRequest.description,
      deadline: bidRequest.deadline,
      school: bidRequest.school.name,
      items: (bidRequest.items || []).map((item: any) => ({
        id: item.id,
        itemName: item.itemName,
        quantity: item.quantity,
        unit: item.unit,
        category: item.category,
      })),
    }));

    console.log("Filtered active bids:", formattedBids);

    res.json({ bids: formattedBids });
  } catch (error) {
    next(error);
  }
};
