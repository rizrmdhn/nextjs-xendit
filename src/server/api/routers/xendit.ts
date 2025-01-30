import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getInvoiceClient } from "@/server/payment-gateway";
import type { CreateInvoiceRequest } from "xendit-node/invoice/models";
import { v7 as uuidv7 } from "uuid";
import { createCheckoutSchema } from "@/schema/checkout.schema";
import { env } from "@/env";
import { createOrder } from "@/server/queries/orders.queries";
import { clearUserCart } from "@/server/queries/user-cart.queries";
import { TRPCError } from "@trpc/server";
import { createOrderItems } from "@/server/queries/order-items.queries";
import { addMinutes, format } from "date-fns";
import { id } from "date-fns/locale";

export const xenditRouter = createTRPCRouter({
  createInvoice: protectedProcedure
    .input(createCheckoutSchema)
    .mutation(async ({ ctx: { user, db }, input }) => {
      const Invoice = getInvoiceClient();

      if (!Invoice) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Payment service not initialized",
        });
      }

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
        // 15 minutes
        invoiceDuration: `${env.INVOICE_EXPIRATION_DURATION}`,
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

      const invoice = await Invoice.createInvoice({ data });

      const dateInvalid = format(
        addMinutes(new Date(), Number(env.INVOICE_EXPIRATION_DURATION)),
        "yyyy-MM-dd HH:mm:ss",
        {
          locale: id,
        },
      );

      await db.transaction(async (transaction) => {
        const data = await createOrder(
          transaction,
          user.id,
          invoice.id ?? "",
          invoice.externalId,
          amount,
          invoice.status,
          dateInvalid,
          invoice.invoiceUrl,
        );

        const mappedItems = input.items.map((item) => ({
          itemId: item.id,
          quantity: item.quantity,
          price: item.price,
        }));

        await createOrderItems(transaction, data.insertedId, mappedItems);
      });

      await clearUserCart(user.id);

      return invoice;
    }),
});
