import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { verify } from "@node-rs/argon2";
import { TRPCError } from "@trpc/server";
import { createTokenCookie, deleteTokenCookie } from "@/server/auth/utils";
import { encrypt } from "@/server/auth";
import { getUserByUsername } from "@/server/queries/users.queries";

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

  details: protectedProcedure.query(async ({ ctx: { user } }) => {
    return user;
  }),
});
