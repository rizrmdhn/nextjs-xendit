import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { itemsRouter } from "./routers/item";
import { authRouter } from "./routers/auth";
import { cartRouter } from "./routers/cart";
import { xenditRouter } from "./routers/xendit";
import { ordersRouter } from "./routers/orders";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  item: itemsRouter,
  cart: cartRouter,
  orders: ordersRouter,
  xendit: xenditRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
