// controllers/paymentController.ts

import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { AppDataSource } from "../config/db";
import { Payment } from "../models/Payment";
import { Delivery } from "../models/Delivery";
import { SupplierOffer } from "../models/SupplierOffer";
import { User } from "../models/User"; // assuming you have this model

const paymentRepo = AppDataSource.getRepository(Payment);
const deliveryRepo = AppDataSource.getRepository(Delivery);
const offerRepo = AppDataSource.getRepository(SupplierOffer);
const userRepo = AppDataSource.getRepository(User);

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
      relations: [
        "offer",
        "offer.bidItem",
        "offer.bidItem.bidRequest",
        "offer.bidItem.bidRequest.school",
      ],
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

    const school = offer.bidItem.bidRequest.school;

    if (school.id !== userId) {
      res.status(403).json({ message: "Unauthorized." });
      return;
    }

    // Create a transaction reference
    const transactionReference = `TXN-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    // Create payment record
    const payment = paymentRepo.create({
      offer,
      school,
      totalAmount,
      paymentMethod,
      status: "pending",
      transactionReference,
    });
    await paymentRepo.save(payment);

    // Initialize transaction with Paystack
    const paystackResponse = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: school.email,
        amount: Math.round(totalAmount * 100), // in kobo
        reference: transactionReference,
        callback_url: `${process.env.APP_FRONTEND_URL}/payment-callback?ref=${transactionReference}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const authorizationUrl = paystackResponse.data.data.authorization_url;

    res.status(200).json({
      message: "Payment initialized successfully.",
      authorizationUrl,
      reference: transactionReference,
    });
  } catch (error) {
    next(error);
  }
};

export const paystackWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const event = req.body;

  if (event.event !== "charge.success") {
    res.sendStatus(200);
    return;
  } // ignore others

  const reference = event.data.reference;

  const payment = await paymentRepo.findOne({
    where: { transactionReference: reference },
    relations: ["offer"],
  });

  if (!payment || payment.status === "paid") {
     res.sendStatus(200);
     return;
  }

  // Confirm via Paystack API
  const verification = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  const { status, amount } = verification.data.data;

  if (status === "success") {
    payment.status = "paid";
    await paymentRepo.save(payment);

    const offer = payment.offer;
    offer.paid = true;
    await offerRepo.save(offer);
  }

  res.sendStatus(200);
};
