import {
  getOrderDetailsByExternalId,
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

  getDetailOrders: protectedProcedure
    .input(z.object({ externalId: z.string() }))
    .query(async ({ input: { externalId } }) => {
      const data = await getOrderDetailsByExternalId(externalId);

      return data;
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
