// controllers/supplierController.ts
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/db";
import { SupplierProfile } from "../models/SupplierProfile";
import { User } from "../models/User";
import { verifySupplierAgainstExternalRegistry } from "./adminController";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { VerificationStatus } from "../models/SupplierProfile";

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

    // Prevent submission if already submitted and not failed
    if (existing && existing.verificationStatus !== "failed") {
      res.status(400).json({ error: "Profile already submitted" });
      return;
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const fdaLicenseFile = files["fdaLicense"]?.[0];
    const registrationCertFile = files["registrationCertificate"]?.[0];
    const ownerIdFile = files["ownerId"]?.[0];

    if (!fdaLicenseFile || !registrationCertFile || !ownerIdFile) {
      res.status(400).json({ message: "Missing required files" });
      return;
    }

    // Upload files to Cloudinary
    const fdaLicenseUrl = await uploadToCloudinary(
      fdaLicenseFile.buffer,
      "supplierDocs"
    );
    const registrationCertificateUrl = await uploadToCloudinary(
      registrationCertFile.buffer,
      "supplierDocs"
    );
    const ownerIdUrl = await uploadToCloudinary(
      ownerIdFile.buffer,
      "supplierDocs"
    );

    if (!fdaLicenseUrl || !registrationCertificateUrl || !ownerIdUrl) {
      console.error("Cloudinary upload failed:", {
        fdaLicenseUrl,
        registrationCertificateUrl,
        ownerIdUrl,
      });

      res.status(500).json({ error: "File upload failed, please try again." });
      return;
    }

    let profile;

    if (existing && existing.verificationStatus === "failed") {
      // Update failed profile
      profile = existing;
      profile.businessName = businessName;
      profile.registrationNumber = registrationNumber;
      profile.taxId = taxId;
      profile.contactPerson = contactPerson;
      profile.phoneNumber = phoneNumber;
      profile.momoNumber = momoNumber;
      profile.bankAccount = bankAccount;
      profile.fdaLicenseUrl = fdaLicenseUrl;
      profile.registrationCertificateUrl = registrationCertificateUrl;
      profile.ownerIdUrl = ownerIdUrl;
      profile.verificationStatus = VerificationStatus.PENDING;
    } else {
      // Create new profile
      profile = profileRepo.create({
        user,
        businessName,
        registrationNumber,
        taxId,
        contactPerson,
        phoneNumber,
        momoNumber,
        bankAccount,
        fdaLicenseUrl,
        registrationCertificateUrl,
        ownerIdUrl,
        verificationStatus: VerificationStatus.PENDING,
      });
    }

    await profileRepo.save(profile);

    // Run external verification
    const isVerified = await verifySupplierAgainstExternalRegistry(
      businessName,
      registrationNumber,
      taxId
    );

    if (isVerified) {
      user.verified = true;
      profile.verificationStatus = VerificationStatus.VERIFIED;
      await userRepo.save(user);
    } else {
      profile.verificationStatus = VerificationStatus.FAILED;
    }

    await profileRepo.save(profile);

    res.status(201).json({ message: "Profile submitted successfully" });
  } catch (error) {
    console.error("Error submitting supplier profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
