// validations/supplierOffer.ts
import { z } from "zod";

export const submitOfferSchema = z.object({
  bidItemId: z.string().uuid(),
  pricePerUnit: z.number().positive("Price must be greater than zero."),
});
