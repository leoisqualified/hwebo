// controllers/adminController.ts
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/db";
import { SupplierProfile } from "../models/SupplierProfile";
import { User } from "../models/User";

const profileRepo = AppDataSource.getRepository(SupplierProfile);
const userRepo = AppDataSource.getRepository(User);

export const getPendingSuppliers = async (_: Request, res: Response) => {
  const profiles = await profileRepo.find({
    relations: ["user"],
    where: { user: { verified: false, role: "supplier" } },
  });
  res.json(profiles);
};

export const getSupplierProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const profile = await profileRepo.findOne({
      relations: ["user"],
      where: { id },
    });
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const verifySupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const profile = await profileRepo.findOne({
      relations: ["user"],
      where: { id },
    });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    profile.user.verified = true;
    await userRepo.save(profile.user);

    res.json({ message: "Supplier approved and verified." });
  } catch (error) {
    next(error);
  }
};

export const rejectSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const profile = await profileRepo.findOne({
      relations: ["user"],
      where: { id },
    });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    await profileRepo.remove(profile);
    await userRepo.remove(profile.user); // Optional: remove the user entirely

    res.json({ message: "Supplier profile rejected and deleted." });
  } catch (error) {
    next(error);
  }
};
