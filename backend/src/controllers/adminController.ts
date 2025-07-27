// controllers/adminController.ts
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/db";
import { SupplierProfile } from "../models/SupplierProfile";
import { User } from "../models/User";
import { Payment } from "../models/Payment";
import { BidItem } from "../models/BidItem";
import { BidRequest } from "../models/BidRequest";
import { promises as fs } from "fs";
import path from "path";

const profileRepo = AppDataSource.getRepository(SupplierProfile);
const userRepo = AppDataSource.getRepository(User);
const paymentRepo = AppDataSource.getRepository(Payment);
const bidRepo = AppDataSource.getRepository(BidRequest);

// export const getPendingSuppliers = async (_: Request, res: Response) => {
//   const profiles = await profileRepo.find({
//     relations: ["user"],
//     where: { user: { verified: false, role: "supplier" } },
//   });
//   res.json(profiles);
// };

export const verifySupplierAgainstExternalRegistry = async (
  businessName: string,
  registrationNumber: string,
  taxId: string
): Promise<boolean> => {
  const filePath = path.join(
    __dirname,
    "..",
    "mock",
    "verifiedBusinesses.json"
  );

  try {
    const data = await fs.readFile(filePath, "utf-8");
    const registry = JSON.parse(data);

    return registry.some(
      (entry: any) =>
        entry.businessName === businessName &&
        entry.registrationNumber === registrationNumber &&
        entry.taxId === taxId
    );
  } catch (error) {
    console.error("Error reading external registry:", error);
    return false;
  }
};

export const getSupplierProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const profile = await profileRepo.findOne({
      relations: ["user"],
      where: { id },
    });
    if (!profile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
};

// export const verifySupplier = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const profile = await profileRepo.findOne({
//       relations: ["user"],
//       where: { id },
//     });
//     if (!profile) {
//       res.status(404).json({ error: "Profile not found" });
//       return;
//     }

//     profile.user.verified = true;
//     await userRepo.save(profile.user);

//     res.json({ message: "Supplier approved and verified." });
//   } catch (error) {
//     next(error);
//   }
// };

export const rejectSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const profile = await profileRepo.findOne({
      relations: ["user"],
      where: { id },
    });
    if (!profile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    await profileRepo.remove(profile);
    await userRepo.remove(profile.user); // Optional: remove the user entirely

    res.json({ message: "Supplier profile rejected and deleted." });
  } catch (error) {
    next(error);
  }
};

export const getAllPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payments = await paymentRepo.find({
      relations: ["offer", "offer.bidItem", "school"],
    });

    res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
};

export const getAllBids = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bids = await bidRepo.find({
      relations: ["items", "items.offers", "school"],
    });

    const enrichedBids = bids.map((bid) => {
      const statuses = bid.items.map((item) => item.status);
      const uniqueStatuses = [...new Set(statuses)];

      let overallStatus = "unknown";
      if (uniqueStatuses.length === 1) {
        overallStatus = uniqueStatuses[0];
      } else if (uniqueStatuses.includes("open")) {
        overallStatus = "open";
      } else {
        overallStatus = "mixed";
      }

      return {
        ...bid,
        status: overallStatus,
      };
    });

    res.status(200).json(enrichedBids);
  } catch (error) {
    next(error);
  }
};

// export const approveSupplier = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { supplierId } = req.body;

//     const supplier = await userRepo.findOneByOrFail({ id: supplierId });

//     supplier.verified = true;

//     await userRepo.save(supplier);

//     res.status(200).json({ message: "Supplier verified successfully." });
//   } catch (error) {
//     next(error);
//   }
// };

export const getUnverifiedSuppliers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const suppliers = await userRepo.find({
      where: { role: "supplier", verified: false },
      relations: ["supplierProfile"],
    });

    res.status(200).json(suppliers);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await AppDataSource.getRepository(User).find({
      relations: ["supplierProfile"],
    });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
