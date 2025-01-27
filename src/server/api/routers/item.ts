import { createTRPCRouter, publicProcedure } from "../trpc";
import { getItems } from "@/server/queries/items.queries";

export const itemsRouter = createTRPCRouter({
  getItems: publicProcedure.query(async () => {
    const items = await getItems();

    return items;
  }),
});
