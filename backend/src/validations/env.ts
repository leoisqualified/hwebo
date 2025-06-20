import { z } from "zod";

export const envSchema = z.object({
  PORT: z.string().regex(/^\d+$/).transform(Number),
  DB_HOST: z.string(),
  DB_PORT: z.string().regex(/^\d+$/).transform(Number),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  JWT_SECRET: z.string().min(7),
});
