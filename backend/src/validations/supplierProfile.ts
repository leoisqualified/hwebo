// validations/supplierProfile.ts
import { z } from "zod";

export const supplierProfileSchema = z.object({
  businessName: z.string(),
  registrationNumber: z.string(),
  taxId: z.string(),
  contactPerson: z.string(),
  phoneNumber: z.string(),
  momoNumber: z.string().optional(),
  bankAccount: z.string().optional(),
});
