import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Invoice } from "@/server/payment-gateway";
import type { CreateInvoiceRequest } from "xendit-node/invoice/models";
import { v7 as uuidv7 } from "uuid";
import { createCheckoutSchema } from "@/schema/checkout.schema";
import { env } from "@/env";
import { createOrder } from "@/server/queries/orders.queries";
import { clearUserCart } from "@/server/queries/user-cart.queries";

export const xenditRouter = createTRPCRouter({
  createInvoice: protectedProcedure
    .input(createCheckoutSchema)
    .mutation(async ({ ctx: { user }, input }) => {
      let amount = 0;
      const externalId = `invoice-${uuidv7()}`;

      if (input.currency !== "USD") {
        amount = input.items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0,
        );

        amount = amount * input.currencyRate;
      }

      const data: CreateInvoiceRequest = {
        amount: amount,
        invoiceDuration: "172800",
        externalId,
        description: input.description,
        currency: input.currency,
        reminderTime: 1,
        customer: {
          id: user.id,
          surname: user.username,
          givenNames: user.username,
        },
        items: input.items.map((item) => ({
          name: item.name,
          price:
            input.currency === "USD"
              ? item.price
              : item.price * input.currencyRate,
          quantity: item.quantity,
        })),
        successRedirectUrl: `${env.SUCCESS_REDIRECT_URL}?externalId=${externalId}`,
      };

      const invoice = await Invoice.createInvoice({
        data,
      });

      await createOrder(
        user.id,
        invoice.id ?? "",
        invoice.externalId,
        amount,
        invoice.status,
      );

      await clearUserCart(user.id);

      return invoice;
    }),
});
