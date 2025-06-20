import { DataSource } from "typeorm";
import { env } from "./index"; // <-- import the validated env, NOT the schema
import { User } from "../models/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  entities: [User],
  synchronize: true,
  logging: false,
});
