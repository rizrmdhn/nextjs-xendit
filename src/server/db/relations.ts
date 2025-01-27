import { relations } from "drizzle-orm/relations";
import { items, orders, sessions, userCart, users } from "./schema";

export const sessionRelations = relations(sessions, ({ one }) => ({
  users: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const userRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  cart: many(userCart),
  orders: many(orders),
}));

export const userCartRelations = relations(userCart, ({ one }) => ({
  users: one(users, {
    fields: [userCart.userId],
    references: [users.id],
  }),
  items: one(items, {
    fields: [userCart.itemId],
    references: [items.id],
  }),
}));
