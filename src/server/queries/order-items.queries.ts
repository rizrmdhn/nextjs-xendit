import { tryCatch } from "@/lib/try-catch";
import { type DBType } from "../db";
import { orderItems } from "../db/schema";
import { error } from "console";

export async function createOrderItems(
  transaction: DBType,
  orderId: string,
  items: { itemId: string; quantity: number; price: number }[],
) {
  const values = items.map((item) => ({
    orderId,
    itemId: item.itemId,
    quantity: item.quantity,
    price: item.price,
  }));

  const result = await tryCatch(
    async () =>
      await transaction.insert(orderItems).values(values).returning().execute(),
  );

  if (result.error) {
    console.error(result.error);
    throw error as unknown as Error;
  }

  return result.result;
}
