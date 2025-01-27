import { relations } from "drizzle-orm/relations";
import { sessions, users } from "./schema";

export const sessionRelations = relations(sessions, ({ one }) => ({
  users: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
