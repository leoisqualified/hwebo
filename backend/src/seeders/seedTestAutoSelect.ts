import { AppDataSource } from "../config/db";
import { autoSelectLowestOffers } from "../utils/autoSelectLowestOffers";
import { User } from "../models/User";
import { SupplierProfile } from "../models/SupplierProfile";
import { BidRequest } from "../models/BidRequest";
import { BidItem } from "../models/BidItem";
import { SupplierOffer } from "../models/SupplierOffer";
import bcrypt from "bcrypt";

// Seed + Run AutoSelect
const main = async () => {
  try {
    await AppDataSource.initialize();
    console.log("DB initialized.");

    const userRepo = AppDataSource.getRepository(User);
    const profileRepo = AppDataSource.getRepository(SupplierProfile);
    const bidRequestRepo = AppDataSource.getRepository(BidRequest);
    const bidItemRepo = AppDataSource.getRepository(BidItem);
    const offerRepo = AppDataSource.getRepository(SupplierOffer);

    console.log("Seeding test data...");

    // Create school
    const school = await userRepo.save(
      userRepo.create({
        email: "school@example.com",
        name: "Test School",
        password: await bcrypt.hash("password", 10),
        role: "school",
        verified: true,
      })
    );

    // Create suppliers
    const suppliers = [];

    for (let i = 1; i <= 3; i++) {
      const supplierUser = await userRepo.save(
        userRepo.create({
          email: `supplier${i}@example.com`,
          name: `Supplier ${i}`,
          password: await bcrypt.hash("password", 10),
          role: "supplier",
          verified: true,
          companyName: `Company ${i}`,
        })
      );

      await profileRepo.save(
        profileRepo.create({
          user: supplierUser,
          businessName: `Business ${i}`,
          registrationNumber: `REG00${i}`,
          taxId: `TAX00${i}`,
          contactPerson: `Contact ${i}`,
          phoneNumber: `024400000${i}`,
          fdaLicenseUrl: "uploads/fda.pdf",
          registrationCertificateUrl: "uploads/cert.pdf",
          ownerIdUrl: "uploads/id.pdf",
          momoNumber: `055000000${i}`,
          bankAccount: `0011000${i}`,
        })
      );

      suppliers.push(supplierUser);
    }

    // Create expired bid request
    const bidRequest = await bidRequestRepo.save(
      bidRequestRepo.create({
        school,
        title: "Expired Food Bid",
        description: "Need onions for test purposes.",
        budget: "3000",
        deadline: new Date(Date.now() - 5 * 60 * 1000),
      })
    );

    const item = await bidItemRepo.save(
      bidItemRepo.create({
        itemName: "Onions",
        quantity: 100,
        unit: "kg",
        category: "Vegetables",
        description: "Fresh red onions",
        bidRequest,
      })
    );

    await Promise.all(
      suppliers.map((supplier, idx) =>
        offerRepo.save(
          offerRepo.create({
            supplier,
            bidItem: item,
            pricePerUnit: 20 + idx * 5, // 20, 25, 30
            status: "pending",
            deliveryTime: "3",
            totalPrice: (20 + idx * 5) * 100,
            paid: false,
          })
        )
      )
    );

    console.log("Test data seeded. Running auto-selection...");

    await autoSelectLowestOffers();

    console.log("Auto-selection completed.");
    process.exit(0);
  } catch (error) {
    console.error("Error during setup:", error);
    process.exit(1);
  }
};

main();
