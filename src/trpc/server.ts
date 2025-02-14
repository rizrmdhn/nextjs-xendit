import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { headers } from "next/headers";
import { cache } from "react";

import { createCaller, type AppRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { createQueryClient } from "./query-client";

import csrf from "csrf";
import { env } from "@/env";

/**
 * CSRF Token
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */

const tokens = new csrf();
const CSRF_TOKEN = env.CSRF_TOKEN ?? tokens.secretSync();

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const token = tokens.create(CSRF_TOKEN);

  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");
  heads.set("x-csrf-token", token);

  return createTRPCContext({
    headers: heads,
  });
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);
