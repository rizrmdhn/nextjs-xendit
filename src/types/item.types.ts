import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { items } from "@/server/db/schema";

export type Items = InferSelectModel<typeof items>;

export type InsertItem = InferInsertModel<typeof items>;
