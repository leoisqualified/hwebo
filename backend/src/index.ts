import { AppDataSource } from "./config/db";
import app from "./app";
import { env } from "./config";

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
