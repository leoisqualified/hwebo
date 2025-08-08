// utils/autoSelectLowestOffers.ts
import { SupplierOffer } from "../models/SupplierOffer";
import { BidItem } from "../models/BidItem";
import { BidRequest } from "../models/BidRequest";
import { AppDataSource } from "../config/db";
import { sendEmail, sendSMS } from "../utils/notifications";

const bidItemRepo = AppDataSource.getRepository(BidItem);
const bidRequestRepo = AppDataSource.getRepository(BidRequest);
const offerRepo = AppDataSource.getRepository(SupplierOffer);

export const autoSelectLowestOffers = async () => {
  const now = new Date();

  const expiredItems = await bidItemRepo
    .createQueryBuilder("item")
    .leftJoinAndSelect("item.bidRequest", "bidRequest")
    .leftJoinAndSelect("item.offers", "offers")
    .leftJoinAndSelect("offers.supplier", "supplier")
    .leftJoinAndSelect("supplier.supplierProfile", "supplierProfile")
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

    const lowestOffer = item.offers.reduce((min, o) =>
      o.pricePerUnit < min.pricePerUnit ? o : min
    );

    await offerRepo
      .createQueryBuilder()
      .update(SupplierOffer)
      .set({ status: "rejected" })
      .where("bidItemId = :itemId AND id != :offerId", {
        itemId: item.id,
        offerId: lowestOffer.id,
      })
      .execute();

    lowestOffer.status = "accepted";
    lowestOffer.totalPrice = lowestOffer.pricePerUnit * item.quantity;
    lowestOffer.deliveryTime = "3";

    await offerRepo.save(lowestOffer);

    const supplier = lowestOffer.supplier;
    const profile = supplier.supplierProfile;

    // Send notification
    const message = `Your offer for "${item.itemName}" has been selected! Total: ${lowestOffer.totalPrice}`;

    if (profile) {
      if (profile.phoneNumber) {
        await sendSMS(profile.phoneNumber, message);
      }

      if (supplier.email) {
        await sendEmail(
          supplier.email,
          "Congratulations! Your Offer Was Selected",
          `Hi ${profile.contactPerson},\n\n${message}\n\nThank you for bidding!`
        );
      }
    } else {
      console.warn(`No supplier profile found for supplier ID: ${supplier.id}`);
    }

    console.log(`Offer ${lowestOffer.id} selected for ${item.itemName}`);
  }

  console.log(`Auto-selection completed at ${now.toISOString()}`);
};
