// controllers/paymentController.ts
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/db";
import { Payment } from "../models/Payment";
import { Delivery } from "../models/Delivery";
import { SupplierOffer } from "../models/SupplierOffer";

const paymentRepo = AppDataSource.getRepository(Payment);
const deliveryRepo = AppDataSource.getRepository(Delivery);
const offerRepo = AppDataSource.getRepository(SupplierOffer);

export const initiatePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { deliveryId, paymentMethod } = req.body;
    const userId = (req as any).user.userId;

    const delivery = await deliveryRepo.findOne({
      where: { id: deliveryId },
      relations: ["offer", "offer.bidItem"],
    });

    if (!delivery) {
      res.status(404).json({ message: "Delivery not found." });
      return;
    }

    if (delivery.status !== "delivered") {
      res.status(400).json({
        message: "Payment cannot be made until delivery is confirmed.",
      });
      return;
    }

    const offer = delivery.offer;

    const totalAmount =
      Number(offer.pricePerUnit) * Number(offer.bidItem.quantity);

    const payment = paymentRepo.create({
      offer,
      school: { id: userId } as any,
      totalAmount,
      paymentMethod,
      status: "pending",
    });

    await paymentRepo.save(payment);

    // Mock payment success
    const mockTransactionReference = `TXN-${Date.now()}`;
    payment.status = "paid";
    payment.transactionReference = mockTransactionReference;
    await paymentRepo.save(payment);

    res.status(201).json({ message: "Payment successful.", payment });
  } catch (error) {
    next(error);
  }
};
