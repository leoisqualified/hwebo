// validations/auth.ts
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["admin", "school", "supplier"]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
