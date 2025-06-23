// controllers/bidRequestController.ts
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/db";
import { BidRequest } from "../models/BidRequest";
import { BidItem } from "../models/BidItem";
import { User } from "../models/User";
import { MoreThan } from "typeorm";

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
    }

    const bidItems = items.map((item: any) => {
      const bidItem = new BidItem();
      bidItem.itemName = item.itemName;
      bidItem.quantity = item.quantity;
      bidItem.unit = item.unit;
      return bidItem;
    });

    const bidRequest = bidRequestRepo.create({
      school: user,
      title,
      description,
      deadline,
      items: bidItems,
    });

    await bidRequestRepo.save(bidRequest);
    res
      .status(201)
      .json({ message: "Bid request created successfully.", bidRequest });
  } catch (error) {
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
