import { DataSource } from "typeorm";
import { env } from "./index";
import { User } from "../models/User";
import { BidItem } from "../models/BidItem";
import { BidRequest } from "../models/BidRequest";
import { Delivery } from "../models/Delivery";
import { Payment } from "../models/Payment";
import { SupplierOffer } from "../models/SupplierOffer";
import { SupplierProfile } from "../models/SupplierProfile";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  entities: [
    User,
    BidItem,
    BidRequest,
    Delivery,
    Payment,
    SupplierOffer,
    SupplierProfile,
  ],
  synchronize: true,
  logging: false,
});
