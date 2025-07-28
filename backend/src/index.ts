import { AppDataSource } from "./config/db";
import app from "./app";
import { env } from "./config";
import cron from "node-cron";
import { autoSelectLowestOffers } from "./utils/autoSelectLowestOffers";

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully.");
    app.listen(env.PORT, () => {
      console.log(`HyɛBɔ backend running on http://localhost:${env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });

// Run every day at midnight (you can adjust schedule as needed)
cron.schedule("0 0 * * *", async () => {
  console.log("Running autoSelectLowestOffers cron job...");
  try {
    await autoSelectLowestOffers();
  } catch (err) {
    console.error("Cron job failed:", err);
  }
});
