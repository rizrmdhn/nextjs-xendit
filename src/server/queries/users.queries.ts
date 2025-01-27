import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

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
    throw new Error("Failed to create user");
  }

  return user;
}
