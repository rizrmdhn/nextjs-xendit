import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { hash, verify } from "@node-rs/argon2";
import { TRPCError } from "@trpc/server";
import { createTokenCookie, deleteTokenCookie } from "@/server/auth/utils";
import { encrypt } from "@/server/auth";
import { createUser, getUserByUsername } from "@/server/queries/users.queries";
import { registerSchema } from "@/schema/auth.schema";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input: { username, password } }) => {
      const user = await getUserByUsername(username);

      if (!user) {
        throw new Error("User not found");
      }

      // verify password
      const verifyPasswordResult = await verify(user.password, password);

      if (!verifyPasswordResult) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid User Credentials",
        });
      }

      // Generate JWT
      const token = await encrypt({
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

      void (await createTokenCookie(token));

      return {
        user: {
          id: user.id,
          username: user.username,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      };
    }),

  logout: protectedProcedure.mutation(async () => {
    void (await deleteTokenCookie());

    return true;
  }),

  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input: { username, password } }) => {
      // hash password
      const passwordHash = await hash(password);

      // create user
      const user = await getUserByUsername(username);

      if (user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exists",
        });
      }

      await createUser(username, passwordHash);

      return true;
    }),

  details: protectedProcedure.query(async ({ ctx: { user } }) => {
    return user;
  }),
});
