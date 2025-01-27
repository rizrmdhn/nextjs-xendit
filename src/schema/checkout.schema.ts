import { z } from "zod";

export const createCheckoutSchema = z.object({
  items: z.array(
    z.object({
      name: z.string(),
      price: z.number().int(),
      quantity: z.number().int(),
    }),
  ),
  currency: z.string(),
  description: z.string(),
  invoiceDuration: z.string(),
  reminderTime: z.number().int(),
  currencyRate: z.number().int(),
});
