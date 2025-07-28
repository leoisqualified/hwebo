// utils/autoSelectLowestOffers.ts
import { SupplierOffer } from "../models/SupplierOffer";
import { BidItem } from "../models/BidItem";
import { BidRequest } from "../models/BidRequest";
import { AppDataSource } from "../config/db";

const bidItemRepo = AppDataSource.getRepository(BidItem);
const bidRequestRepo = AppDataSource.getRepository(BidRequest);
const offerRepo = AppDataSource.getRepository(SupplierOffer);

export const autoSelectLowestOffers = async () => {
  const now = new Date();

  // Get all bid items whose parent request has expired and no winner has been selected
  const expiredItems = await bidItemRepo
    .createQueryBuilder("item")
    .leftJoinAndSelect("item.bidRequest", "bidRequest")
    .leftJoinAndSelect("item.offers", "offers")
    .where("bidRequest.deadline < :now", { now })
    .andWhere((qb) => {
      const subQuery = qb
        .subQuery()
        .select("1")
        .from(SupplierOffer, "so")
        .where("so.bidItemId = item.id")
        .andWhere("so.status = :status", { status: "accepted" })
        .getQuery();
      return `NOT EXISTS ${subQuery}`;
    })
    .getMany();

  for (const item of expiredItems) {
    if (!item.offers.length) continue;

    // Find lowest price offer
    const lowestOffer = item.offers.reduce((min, o) =>
      o.pricePerUnit < min.pricePerUnit ? o : min
    );

    // Reject all others
    await offerRepo
      .createQueryBuilder()
      .update(SupplierOffer)
      .set({ status: "rejected" })
      .where("bidItemId = :itemId AND id != :offerId", {
        itemId: item.id,
        offerId: lowestOffer.id,
      })
      .execute();

    // Accept lowest
    lowestOffer.status = "accepted";
    lowestOffer.totalPrice = lowestOffer.pricePerUnit * item.quantity;
    lowestOffer.deliveryTime = "3"; // or default

    await offerRepo.save(lowestOffer);

    // Optional: Send notification to winner
    console.log(
      `✅ Offer ${lowestOffer.id} selected as winner for item ${item.itemName}`
    );
  }

  console.log(`Auto-selection completed at ${now.toISOString()}`);
};
