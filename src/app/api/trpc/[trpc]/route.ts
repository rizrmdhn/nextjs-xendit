import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

import { env } from "@/env";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import csrf from "csrf";

const csrfProtection = new csrf();
const secret = env.CSRF_TOKEN; // Store securely!

if (!secret) {
  throw new Error("CSRF_SECRET environment variable is required.");
}

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  });
};

const handler = async (req: NextRequest) => {
  if (req.method === "POST") {
    // Verify CSRF token
    const csrfToken = req.headers.get("x-csrf-token");
    if (!csrfToken) {
      return new Response(JSON.stringify({ error: "CSRF token missing" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      csrfProtection.verify(secret, csrfToken);
    } catch {
      return new Response(JSON.stringify({ error: "CSRF token invalid" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Proceed with your tRPC handler
    return fetchRequestHandler({
      endpoint: "/api/trpc",
      req,
      router: appRouter,
      createContext: () => createContext(req),
      onError:
        env.NODE_ENV === "development"
          ? ({ path, error }) => {
              console.error(
                `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
              );
            }
          : undefined,
    });
  } else if (req.method === "GET") {
    // Generate a new CSRF token for the client
    const token = csrfProtection.create(secret);
    return new Response(JSON.stringify({ csrfToken: token }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export { handler as GET, handler as POST };
