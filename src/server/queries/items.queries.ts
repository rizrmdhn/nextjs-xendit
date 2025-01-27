import { db } from "../db";

export async function getItems() {
  const items = await db.query.items.findMany();

  return items;
}
