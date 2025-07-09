import { AppDataSource } from "../../src/config/db";

const resetDatabase = async () => {
  const queryRunner = AppDataSource.createQueryRunner();

  try {
    await AppDataSource.initialize();
    await queryRunner.connect();

    console.log("Resetting database...");

    await queryRunner.startTransaction();

    await queryRunner.query(`
      TRUNCATE 
        "delivery",
        "payment",
        "supplier_offer",
        "bid_item",
        "bid_request",
        "supplier_profile",
        "user"
      RESTART IDENTITY CASCADE;
    `);

    await queryRunner.commitTransaction();
    console.log("Database reset successfully.");
    process.exit(0);
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error("Error resetting database:", error);
    process.exit(1);
  } finally {
    await queryRunner.release();
  }
};

resetDatabase();
