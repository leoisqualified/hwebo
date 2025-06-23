// controllers/deliveryController.ts
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/db";
import { Delivery } from "../models/Delivery";
import { SupplierOffer } from "../models/SupplierOffer";

const deliveryRepo = AppDataSource.getRepository(Delivery);
const offerRepo = AppDataSource.getRepository(SupplierOffer);

export const startDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { offerId } = req.body;

    const offer = await offerRepo.findOneByOrFail({ id: offerId });

    const delivery = deliveryRepo.create({
      offer,
      status: "in_progress",
    });

    await deliveryRepo.save(delivery);

    res.status(201).json({ message: "Delivery started.", delivery });
  } catch (error) {
    next(error);
  }
};

export const completeDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { deliveryId, notes } = req.body;

    const delivery = await deliveryRepo.findOneByOrFail({ id: deliveryId });
    delivery.status = "delivered";
    delivery.deliveryNotes = notes;

    await deliveryRepo.save(delivery);

    res
      .status(200)
      .json({ message: "Delivery marked as completed.", delivery });
  } catch (error) {
    next(error);
  }
};

export const confirmDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { deliveryId } = req.body;

    const delivery = await deliveryRepo.findOneByOrFail({ id: deliveryId });
    if (delivery.status !== "delivered")
      res.status(400).json({
        message: "Delivery is not yet marked as completed by supplier.",
      });

    // Delivery is accepted → payment can now be initiated
    res.status(200).json({
      message: "Delivery confirmed by school. Proceed to payment.",
      delivery,
    });
  } catch (error) {
    next(error);
  }
};
