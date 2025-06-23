// validations/delivery.ts
import { z } from "zod";

export const startDeliverySchema = z.object({
  offerId: z.string().uuid(),
});

export const completeDeliverySchema = z.object({
  deliveryId: z.string().uuid(),
  notes: z.string().optional(),
});

export const confirmDeliverySchema = z.object({
  deliveryId: z.string().uuid(),
});
