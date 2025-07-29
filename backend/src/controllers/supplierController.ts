// controllers/supplierController.ts
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/db";
import { SupplierProfile } from "../models/SupplierProfile";
import { User } from "../models/User";
import { verifySupplierAgainstExternalRegistry } from "./adminController";

const profileRepo = AppDataSource.getRepository(SupplierProfile);
const userRepo = AppDataSource.getRepository(User);

export const submitSupplierProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      businessName,
      registrationNumber,
      taxId,
      contactPerson,
      phoneNumber,
      momoNumber,
      bankAccount,
    } = req.body;

    const userId = (req as any).user.userId;
    const user = await userRepo.findOneByOrFail({ id: userId });

    if (user.role !== "supplier") {
      res.status(403).json({ error: "Unauthorized" });
      return;
    }

    const existing = await profileRepo.findOne({
      where: { user: { id: user.id } },
    });
    if (existing) res.status(400).json({ error: "Profile already submitted" });

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const fdaLicenseFile = files["fdaLicense"]?.[0];
    const registrationCertFile = files["registrationCertificate"]?.[0];
    const ownerIdFile = files["ownerId"]?.[0];

    if (!fdaLicenseFile || !registrationCertFile || !ownerIdFile) {
      res.status(400).json({ message: "Missing required files" });
    }

    const profile = profileRepo.create({
      user,
      businessName,
      registrationNumber,
      taxId,
      contactPerson,
      phoneNumber,
      momoNumber,
      bankAccount,
      fdaLicenseUrl: fdaLicenseFile.filename,
      registrationCertificateUrl: registrationCertFile.filename,
      ownerIdUrl: ownerIdFile.filename,
    });

    await profileRepo.save(profile);

    // Check external registry for auto-verification
    const isVerified = await verifySupplierAgainstExternalRegistry(
      businessName,
      registrationNumber,
      taxId
    );

    if (isVerified) {
      user.verified = true;
      await userRepo.save(user);
    }

    res.status(201).json({ message: "Profile submitted successfully" });
  } catch (error) {
    console.error("Error submitting supplier profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
