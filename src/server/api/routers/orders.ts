import {
  getUserOrders,
  updateOrderStatus,
} from "@/server/queries/orders.queries";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { InvoiceStatus } from "xendit-node/invoice/models";

export const ordersRouter = createTRPCRouter({
  getList: protectedProcedure.query(async ({ ctx: { user } }) => {
    const orders = await getUserOrders(user.id);

    return orders;
  }),

  updateOrderStatus: protectedProcedure
    .input(
      z.object({
        externalId: z.string(),
        status: z.nativeEnum(InvoiceStatus),
      }),
    )
    .mutation(async ({ ctx: { user }, input: { externalId, status } }) => {
      const data = await updateOrderStatus(user.id, externalId, status);

      return data;
    }),
});
