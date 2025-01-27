import type { InferInsertModel } from "drizzle-orm";
import type { users } from "@/server/db/schema";

import type { InferQueryModel } from "./utils.types";

export type Users = InferQueryModel<
  "users",
  {
    columns: {
      password: false;
    };
  }
>;

export type InsertUser = InferInsertModel<typeof users>;
