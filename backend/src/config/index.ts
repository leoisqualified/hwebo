// config/index.ts
import dotenv from "dotenv";
import { envSchema } from "../validations/env";

dotenv.config();

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:", parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data; // THIS is your typed env variables!
