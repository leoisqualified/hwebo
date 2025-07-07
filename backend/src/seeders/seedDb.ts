import { AppDataSource } from "../../src/config/db";
import { User } from "../../src/models/User";
import { SupplierProfile } from "../../src/models/SupplierProfile";
import { BidRequest } from "../../src/models/BidRequest";
import { BidItem } from "../../src/models/BidItem";
import { SupplierOffer } from "../../src/models/SupplierOffer";
import { Payment } from "../../src/models/Payment";
import { Delivery } from "../../src/models/Delivery";

const seedDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Seeding database...");

    // 1. Create Users
    const admin = await AppDataSource.getRepository(User).save({
      email: "admin@example.com",
      password: "hashed_password", // Replace with actual hash
      role: "admin",
      verified: true,
    });

    const school = await AppDataSource.getRepository(User).save({
      email: "school@example.com",
      name: "Sample School",
      password: "hashed_password", // Replace with actual hash
      role: "school",
      verified: true,
    });

    const supplier = await AppDataSource.getRepository(User).save({
      email: "supplier@example.com",
      name: "Sample Supplier",
      password: "hashed_password", // Replace with actual hash
      role: "supplier",
      verified: true,
    });

    // 2. Create Supplier Profile
    await AppDataSource.getRepository(SupplierProfile).save({
      user: supplier,
      businessName: "Supplier Co.",
      registrationNumber: "REG123456",
      taxId: "TAX987654",
      contactPerson: "John Doe",
      phoneNumber: "1234567890",
      fdaLicenseUrl: "uploads/fda_license.pdf",
      registrationCertificateUrl: "uploads/registration_cert.pdf",
      ownerIdUrl: "uploads/owner_id.pdf",
      momoNumber: "0244000000",
      bankAccount: "0011223344",
    });

    // 3. Create Bid Request
    const bidRequest = await AppDataSource.getRepository(BidRequest).save({
      school: school,
      title: "Food Supply for Term 1",
      budget: "5000",
      description: "We need maize and rice for the upcoming term.",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    });

    // 4. Create Bid Items
    const maizeItem = await AppDataSource.getRepository(BidItem).save({
      itemName: "Maize",
      quantity: 100,
      unit: "bags",
      category: "Cereals",
      bidRequest: bidRequest,
      description: "White maize, grade A",
    });

    const riceItem = await AppDataSource.getRepository(BidItem).save({
      itemName: "Rice",
      quantity: 50,
      unit: "bags",
      category: "Cereals",
      bidRequest: bidRequest,
      description: "Long grain rice",
    });

    // 5. Create Supplier Offers
    const maizeOffer = await AppDataSource.getRepository(SupplierOffer).save({
      supplier: supplier,
      bidItem: maizeItem,
      pricePerUnit: 50,
      notes: "Quality maize with timely delivery.",
      status: "pending",
    });

    const riceOffer = await AppDataSource.getRepository(SupplierOffer).save({
      supplier: supplier,
      bidItem: riceItem,
      pricePerUnit: 70,
      notes: "Premium long grain rice.",
      status: "pending",
    });

    // 6. Create Payments
    await AppDataSource.getRepository(Payment).save({
      offer: maizeOffer,
      school: school,
      totalAmount: 5000,
      paymentMethod: "mobile_money",
      status: "pending",
    });

    await AppDataSource.getRepository(Payment).save({
      offer: riceOffer,
      school: school,
      totalAmount: 3500,
      paymentMethod: "bank_card",
      status: "pending",
    });

    // 7. Create Deliveries
    await AppDataSource.getRepository(Delivery).save({
      offer: maizeOffer,
      status: "pending",
    });

    await AppDataSource.getRepository(Delivery).save({
      offer: riceOffer,
      status: "pending",
    });

    console.log("✅ Database seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
