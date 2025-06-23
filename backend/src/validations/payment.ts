// validations/payment.ts
import { z } from "zod";

export const initiatePaymentSchema = z.object({
  deliveryId: z.string().uuid(),
  paymentMethod: z.enum(["mobile_money", "bank_transfer"]),
});
