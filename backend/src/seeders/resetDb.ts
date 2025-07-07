import { AppDataSource } from "../../src/config/db";
import { SupplierOffer } from "../../src/models/SupplierOffer";
import { BidItem } from "../../src/models/BidItem";
import { BidRequest } from "../../src/models/BidRequest";
import { Delivery } from "../../src/models/Delivery";
import { SupplierProfile } from "../../src/models/SupplierProfile";
import { Payment } from "../../src/models/Payment";
import { User } from "../../src/models/User";

const resetDatabase = async () => {
  try {
    await AppDataSource.initialize();

    console.log("Resetting database...");

    // Start from the most dependent (children) to the parent
    await AppDataSource.getRepository(Delivery).delete({});
    await AppDataSource.getRepository(Payment).delete({});
    await AppDataSource.getRepository(SupplierOffer).delete({});
    await AppDataSource.getRepository(BidItem).delete({});
    await AppDataSource.getRepository(BidRequest).delete({});
    await AppDataSource.getRepository(SupplierProfile).delete({});
    await AppDataSource.getRepository(User).delete({});

    console.log("Database reset successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error resetting database:", error);
    process.exit(1);
  }
};

resetDatabase();
