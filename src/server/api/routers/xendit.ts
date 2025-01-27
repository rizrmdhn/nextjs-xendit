import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Invoice } from "@/server/payment-gateway";
import type { CreateInvoiceRequest } from "xendit-node/invoice/models";

export const xenditRouter = createTRPCRouter({
  createInvoice: protectedProcedure.mutation(async ({ ctx: { user } }) => {
    const data: CreateInvoiceRequest = {
      amount: 10000,
      invoiceDuration: "172800",
      externalId: "test1234",
      description: "Test Invoice",
      currency: "IDR",
      reminderTime: 1,
      customer: {
        id: user.id,
        surname: user.username,
        givenNames: user.username,
      },
    };

    return await Invoice.createInvoice({
      data,
    });
  }),
});
