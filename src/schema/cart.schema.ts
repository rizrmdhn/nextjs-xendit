import { z } from "zod";

export const addToCartSchema = z.object({
  name: z.string(),
  itemId: z.string(),
  quantity: z.number().int(),
});
