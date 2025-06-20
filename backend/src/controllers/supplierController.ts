// controllers/supplierController.ts
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/db";
import { SupplierProfile } from "../models/SupplierProfile";
import { User } from "../models/User";

const profileRepo = AppDataSource.getRepository(SupplierProfile);
const userRepo = AppDataSource.getRepository(User);

export const submitSupplierProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    if (user.role !== "supplier")
      return res.status(403).json({ error: "Unauthorized" });

    const existing = await profileRepo.findOne({
      where: { user: { id: user.id } },
    });
    if (existing)
      return res.status(400).json({ error: "Profile already submitted" });

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const fdaLicenseFile = files["fdaLicense"]?.[0];
    const registrationCertFile = files["registrationCertificate"]?.[0];
    const ownerIdFile = files["ownerId"]?.[0];

    if (!fdaLicenseFile || !registrationCertFile || !ownerIdFile) {
      return res.status(400).json({ message: "Missing required files" });
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
      fdaLicenseUrl: fdaLicenseFile.filename, // or use full path if needed
      registrationCertificateUrl: registrationCertFile.filename,
      ownerIdUrl: ownerIdFile.filename,
    });

    await profileRepo.save(profile);
    res
      .status(201)
      .json({ message: "KYC submitted. Await admin verification." });
  } catch (error) {
    next(error);
  }
};
