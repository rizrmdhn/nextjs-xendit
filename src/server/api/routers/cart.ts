import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { addToCartSchema } from "@/schema/cart.schema";
import {
  addItemToCart,
  getUserCart,
  removeItemFromCart,
} from "@/server/queries/user-cart.queries";

export const cartRouter = createTRPCRouter({
  addToCart: protectedProcedure
    .input(addToCartSchema)
    .mutation(async ({ ctx: { user }, input: { itemId, quantity } }) => {
      return await addItemToCart(user.id, itemId, quantity);
    }),

  removeFromCart: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
      }),
    )
    .mutation(async ({ ctx: { user }, input: { itemId } }) => {
      // Remove item from cart
      return await removeItemFromCart(user.id, itemId);
    }),

  getCart: protectedProcedure.query(async ({ ctx: { user } }) => {
    // Get cart
    return await getUserCart(user.id);
  }),
});
