import { AppDataSource } from "../../src/config/db";
import { User } from "../../src/models/User";
import { SupplierProfile } from "../../src/models/SupplierProfile";
import { BidRequest } from "../../src/models/BidRequest";
import { BidItem } from "../../src/models/BidItem";
import { SupplierOffer } from "../../src/models/SupplierOffer";
import { Payment } from "../../src/models/Payment";
import { Delivery } from "../../src/models/Delivery";
import bcrypt from "bcryptjs";

const seedDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Seeding database...");

    const userRepo = AppDataSource.getRepository(User);
    const profileRepo = AppDataSource.getRepository(SupplierProfile);
    const bidRequestRepo = AppDataSource.getRepository(BidRequest);
    const bidItemRepo = AppDataSource.getRepository(BidItem);
    const offerRepo = AppDataSource.getRepository(SupplierOffer);
    const paymentRepo = AppDataSource.getRepository(Payment);
    const deliveryRepo = AppDataSource.getRepository(Delivery);

    // --- Create Admin ---
    // console.log("Creating admin...");
    const admin = await userRepo.save(
      userRepo.create({
        email: "admin@example.com",
        password: await bcrypt.hash("password", 10),
        role: "admin",
        verified: true,
      })
    );

    // --- Create School ---
    // console.log("Creating school...");
    const school = await userRepo.save(
      userRepo.create({
        email: "school@example.com",
        name: "Sample School",
        password: await bcrypt.hash("password", 10),
        role: "school",
        verified: true,
      })
    );

    // --- Create Supplier ---
    // console.log("Creating supplier and profile...");
    const verifiedSupplier = await userRepo.save(
      userRepo.create({
        email: "supplier1@example.com",
        name: "Sample Supplier",
        password: await bcrypt.hash("password", 10),
        role: "supplier",
        verified: true,
        companyName: "Supplier Co.",
      })
    );

    // --- Create Unverified Supplier ---
    const unverifiedSupplier = await userRepo.save(
      userRepo.create({
        email: "supplier2@example.com",
        name: "Unverified Supplier",
        password: await bcrypt.hash("password", 10),
        role: "supplier",
        verified: false,
        companyName: "NewCo Unverified Ltd.",
      })
    );

    const profile = await profileRepo.save(
      profileRepo.create({
        user: verifiedSupplier,
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
      })
    );

    // --- Create Bid Request ---
    // console.log("Creating bid request...");
    const bidRequest = await bidRequestRepo.save(
      bidRequestRepo.create({
        school,
        title: "Food Supply for Term 1",
        budget: "5000",
        description: "We need maize and rice for the upcoming term.",
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      })
    );

    // --- Create Bid Items ---
    // console.log("Creating bid items...");
    const maizeItem = await bidItemRepo.save(
      bidItemRepo.create({
        itemName: "Maize",
        quantity: 100,
        unit: "bags",
        category: "Cereals",
        description: "White maize, grade A",
        bidRequest,
      })
    );

    const riceItem = await bidItemRepo.save(
      bidItemRepo.create({
        itemName: "Rice",
        quantity: 50,
        unit: "bags",
        category: "Cereals",
        description: "Long grain rice",
        bidRequest,
      })
    );

    // --- Create Offers ---
    // console.log("Creating supplier offers...");
    const maizeOffer = await offerRepo.save(
      offerRepo.create({
        supplier: verifiedSupplier,
        bidItem: maizeItem,
        pricePerUnit: 50.0,
        notes: "Quality maize with timely delivery.",
        status: "accepted",
        deliveryTime: "3",
        totalPrice: 50.0 * 100,
        paid: false,
      })
    );

    const riceOffer = await offerRepo.save(
      offerRepo.create({
        supplier: verifiedSupplier,
        bidItem: riceItem,
        pricePerUnit: 70.0,
        notes: "Premium long grain rice.",
        status: "pending",
        deliveryTime: "3",
        totalPrice: 70.0 * 50,
        paid: false,
      })
    );

    // --- Create a Bid Request with NO supplier offers ---
    const emptyBidRequest = await bidRequestRepo.save(
      bidRequestRepo.create({
        school,
        title: "Stationery Supply for Term 1",
        budget: "2000",
        description: "Need pens, notebooks, and chalk for classrooms.",
        deadline: new Date(Date.now() + 5 * 60 * 1000),
      })
    );

    // --- Add Bid Items to the Request ---
    const penItem = await bidItemRepo.save(
      bidItemRepo.create({
        itemName: "Ballpoint Pens",
        quantity: 200,
        unit: "pieces",
        category: "Stationery",
        description: "Blue and black pens",
        bidRequest: emptyBidRequest,
      })
    );

    // const notebookItem = await bidItemRepo.save(
    //   bidItemRepo.create({
    //     itemName: "Notebooks",
    //     quantity: 100,
    //     unit: "pieces",
    //     category: "Stationery",
    //     description: "A4 100-page notebooks",
    //     bidRequest: emptyBidRequest,
    //   })
    // );

    // --- Create Payments ---
    // console.log("Creating payments...");
    await paymentRepo.save(
      paymentRepo.create({
        offer: maizeOffer,
        school,
        totalAmount: 5000,
        paymentMethod: "mobile_money",
        status: "pending",
      })
    );

    await paymentRepo.save(
      paymentRepo.create({
        offer: riceOffer,
        school,
        totalAmount: 3500,
        paymentMethod: "bank_card",
        status: "pending",
      })
    );

    // --- Create Deliveries ---
    // console.log("Creating deliveries...");

    // Re-save offers to make sure they are fully saved and flushed (optional safety)
    const [savedMaizeOffer, savedRiceOffer] = await offerRepo.save([
      maizeOffer,
      riceOffer,
    ]);

    const maizeDelivery = deliveryRepo.create({
      offer: savedMaizeOffer,
      status: "pending",
    });

    const riceDelivery = deliveryRepo.create({
      offer: savedRiceOffer,
      status: "pending",
    });

    await deliveryRepo.save([maizeDelivery, riceDelivery]);

    console.log("Database seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
