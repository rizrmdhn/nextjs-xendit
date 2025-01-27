import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { TRPCError } from "@trpc/server";

export async function getUserByUsername(username: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  return user;
}

export async function createUser(username: string, password: string) {
  const [user] = await db
    .insert(users)
    .values({
      username,
      password,
    })
    .returning()
    .execute();

  if (!user) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create user",
    });
  }

  return user;
}
