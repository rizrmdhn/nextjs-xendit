// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `${name}`);

export const users = createTable(
  "users",
  {
    id: uuid("id")
      .primaryKey()
      .notNull()
      .$default(() => uuidv7()),
    username: varchar("username", { length: 50 }).notNull(),
    password: varchar("password", { length: 150 }).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    })
      .$default(() => sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }),
  },
  (table) => [
    unique("username_unique").on(table.username),
    index("username_idx").using("btree", table.username),
    index("user_idx").using("btree", table.id),
  ],
);

export const sessions = createTable(
  "sessions",
  {
    id: uuid("id")
      .primaryKey()
      .notNull()
      .$default(() => uuidv7()),
    userId: uuid("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
  },
  (session) => {
    return [
      index("session_id_idx").on(session.id),
      index("user_id_idx").on(session.userId),
    ];
  },
);

export const items = createTable(
  "items",
  {
    id: uuid("id")
      .primaryKey()
      .notNull()
      .$default(() => uuidv7()),
    name: varchar("name", { length: 50 }).notNull(),
    description: varchar("description", { length: 255 }),
    price: integer("price").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    })
      .$default(() => sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }),
  },
  (table) => [
    unique("items_name_unique").on(table.name),
    index("items_name_idx").using("btree", table.name),
    index("items_item_idx").using("btree", table.id),
  ],
);

export const userCart = createTable(
  "user_cart",
  {
    id: uuid("id")
      .primaryKey()
      .notNull()
      .$default(() => uuidv7()),
    userId: uuid("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    itemId: uuid("item_id")
      .references(() => items.id, {
        onDelete: "cascade",
      })
      .notNull(),
    quantity: integer("quantity").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    })
      .$default(() => sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("userCart_user_id_idx").using("btree", table.userId),
    index("userCart_item_id_idx").using("btree", table.itemId),
  ],
);

export const orders = createTable(
  "orders",
  {
    id: uuid("id")
      .primaryKey()
      .notNull()
      .$default(() => uuidv7()),
    userId: uuid("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    itemId: uuid("item_id")
      .references(() => items.id, {
        onDelete: "cascade",
      })
      .notNull(),
    quantity: integer("quantity").notNull(),
    price: integer("price").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    })
      .$default(() => sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [index("orders_user_id_idx").using("btree", table.userId)],
);
