import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { addToCartSchema } from "@/schema/cart.schema";
import {
  addItemToCart,
  getUserCart,
  getUserCartCount,
  getUserCartTotal,
  removeItemFromCart,
  updateCartItemQuantity,
} from "@/server/queries/user-cart.queries";

export const cartRouter = createTRPCRouter({
  addToCart: protectedProcedure
    .input(addToCartSchema)
    .mutation(async ({ ctx: { user }, input: { itemId, quantity } }) => {
      return await addItemToCart(user.id, itemId, quantity);
    }),

  cartItemCounter: protectedProcedure.query(async ({ ctx: { user } }) => {
    return await getUserCartCount(user.id);
  }),

  cartTotal: protectedProcedure.query(async ({ ctx: { user, headers } }) => {
    console.log(headers);
    return await getUserCartTotal(user.id);
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

  updateItemQuantity: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
        quantity: z.number(),
      }),
    )
    .mutation(async ({ ctx: { user }, input: { itemId, quantity } }) => {
      return await updateCartItemQuantity(user.id, itemId, quantity);
    }),

  getCart: protectedProcedure.query(async ({ ctx: { user } }) => {
    // Get cart
    return await getUserCart(user.id);
  }),
});
