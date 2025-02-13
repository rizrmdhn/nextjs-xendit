import { and, eq } from "drizzle-orm";
import { db, type DBType } from "../db";
import { orders } from "../db/schema";
import { TRPCError } from "@trpc/server";
import type { InvoiceStatus } from "xendit-node/invoice/models";

export async function getUserOrders(userId: string) {
  const data = await db.query.orders.findMany({
    where: eq(orders.userId, userId),
  });

  return data;
}

export async function getOrderById(userId: string, orderId: string) {
  const data = await db.query.orders.findFirst({
    where: and(eq(orders.userId, userId), eq(orders.id, orderId)),
  });

  return data;
}

export async function getWebhookOrderByExternalId(externalId: string) {
  const data = await db.query.orders.findFirst({
    where: eq(orders.externalId, externalId),
  });

  return data;
}

export async function getOrderByExternalId(externalId: string) {
  const data = await db.query.orders.findFirst({
    where: eq(orders.externalId, externalId),
  });

  if (!data) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Order not found",
    });
  }

  return data;
}

export async function getOrderDetailsByExternalId(externalId: string) {
  const data = await db.query.orders.findFirst({
    where: eq(orders.externalId, externalId),
    with: {
      users: true,
      orderItems: {
        with: {
          items: true,
        },
      },
    },
  });

  if (!data) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Order not found",
    });
  }

  return data;
}

export async function createOrder(
  transaction: DBType,
  userId: string,
  invoiceId: string,
  externalId: string,
  total: number,
  status: string,
  invalidTime: string,
  invoiceUrl: string,
) {
  const [data] = await transaction
    .insert(orders)
    .values({
      userId,
      invoiceId,
      externalId,
      total,
      status,
      invalidTime,
      invoiceUrl,
    })
    .returning({
      insertedId: orders.id,
    })
    .execute();

  if (!data) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create order",
    });
  }

  return data;
}

export async function updateOrderByExternalIdStatus(
  externalId: string,
  status: InvoiceStatus,
  removeInvoiceUrl?: boolean,
) {
  const isExists = await db.query.orders.findFirst({
    where: eq(orders.externalId, externalId),
  });

  if (!isExists) {
    throw new Error("Order not found");
  }

  const data = await db
    .update(orders)
    .set({
      status,
      invoiceUrl: removeInvoiceUrl ? null : orders.invoiceUrl,
    })
    .where(eq(orders.externalId, externalId));

  return data;
}

export async function updateOrderStatus(
  userId: string,
  externalId: string,
  status: InvoiceStatus,
) {
  const isExists = await db.query.orders.findFirst({
    where: and(eq(orders.userId, userId), eq(orders.externalId, externalId)),
  });

  if (!isExists) {
    throw new Error("Order not found");
  }

  const data = await db
    .update(orders)
    .set({
      status,
    })
    .where(and(eq(orders.userId, userId), eq(orders.externalId, externalId)));

  if (!data) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Order not found",
    });
  }

  return data;
}
