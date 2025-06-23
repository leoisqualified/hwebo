// validations/bidRequest.ts
import { z } from "zod";

export const createBidRequestSchema = z.object({
  items: z.array(
    z.object({
      itemName: z.string().min(1, "Item name is required."),
      quantity: z.number().positive("Quantity must be greater than zero."),
      unit: z.string().min(1, "Unit is required."),
    })
  ),
  deadline: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Deadline must be a valid date.",
  }),
});
