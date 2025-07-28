// controllers/bidRequestController.ts
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/db";
import { BidRequest } from "../models/BidRequest";
import { BidItem } from "../models/BidItem";
import { User } from "../models/User";
import { MoreThan } from "typeorm";
import { batchSendBidNotifications } from "../utils/mailer";
import { sendBidNotificationSMS } from "../utils/sms"; // assuming you’ve created this

const bidRequestRepo = AppDataSource.getRepository(BidRequest);
const userRepo = AppDataSource.getRepository(User);

export const createBidRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, deadline, items } = req.body;

    const userId = (req as any).user.userId;
    const user = await userRepo.findOneByOrFail({ id: userId });

    if (user.role !== "school") {
      res.status(403).json({ error: "Only schools can create bid requests." });
      return;
    }

    const bidItems = items.map((item: any) => {
      const bidItem = new BidItem();
      bidItem.itemName = item.itemName;
      bidItem.quantity = item.quantity;
      bidItem.unit = item.unit;
      bidItem.category = item.category;
      bidItem.description = item.description;
      return bidItem;
    });

    const bidRequest = bidRequestRepo.create({
      school: user,
      title,
      description,
      deadline,
      items: bidItems,
    });

    bidRequest.items.forEach((item) => {
      item.bidRequest = bidRequest;
    });

    await bidRequestRepo.save(bidRequest);

    // 🟡 Add notifications here
    const suppliers = await userRepo.find({
      where: { role: "supplier", verified: true },
      relations: ["supplierProfile"],
    });

    const emailList = suppliers.map((s) => ({
      email: s.email,
      name: s.name || s.companyName || "Supplier",
    }));

    await batchSendBidNotifications(
      emailList,
      bidRequest.title,
      bidRequest.deadline
    );

    // 🔔 Optional SMS
    for (const s of suppliers) {
      if (s.supplierProfile?.phoneNumber) {
        await sendBidNotificationSMS(
          s.supplierProfile.phoneNumber,
          s.name || s.companyName || "Supplier",
          bidRequest.title,
          bidRequest.deadline
        );
      }
    }

    // ✅ Final response
    const responsePayload = {
      id: bidRequest.id,
      title: bidRequest.title,
      description: bidRequest.description,
      deadline: bidRequest.deadline,
      school: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      items: bidRequest.items.map((item) => ({
        id: item.id,
        itemName: item.itemName,
        quantity: item.quantity,
        unit: item.unit,
        category: item.category,
        description: item.description,
      })),
      createdAt: bidRequest.createdAt,
    };

    res.status(201).json({
      message: "Bid request created successfully.",
      bidRequest: responsePayload,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    next(error);
  }
};

export const getActiveBidRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const now = new Date();
    const activeBids = await bidRequestRepo.find({
      where: { deadline: MoreThan(new Date()) },
      relations: ["items", "school"],
      order: { createdAt: "DESC" },
    });

    res.json({ activeBids });
  } catch (error) {
    next(error);
  }
};

export const getBidRequestById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const bidRequest = await bidRequestRepo.findOne({
      where: { id },
      relations: ["items", "school"],
    });

    if (!bidRequest) {
      res.status(404).json({ error: "Bid request not found." });
    }

    res.json({ bidRequest });
  } catch (error) {
    next(error);
  }
};

export const getMyBids = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user.userId;

    const myBids = await bidRequestRepo
      .createQueryBuilder("bidRequest")
      .leftJoinAndSelect("bidRequest.items", "items")
      .leftJoinAndSelect("items.offers", "offers")
      .leftJoinAndSelect("offers.supplier", "supplier")
      .leftJoinAndSelect("bidRequest.school", "school")
      .where("school.id = :userId", { userId })
      .orderBy("bidRequest.createdAt", "DESC")
      .getMany();

    res.json({ myBids });
  } catch (error) {
    console.error("Error fetching my bids:", error);
    next(error);
  }
};
