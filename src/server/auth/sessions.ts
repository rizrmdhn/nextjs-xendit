import { cache } from "react";
import { cookies } from "next/headers";

import type { SessionValidationResult } from "@/types/sessions.types";

import { validateSessionsToken } from "@/server/queries/sessions.queries";

export const getCurrentSession = cache(
  async (): Promise<SessionValidationResult> => {
    const awaitedCookies = await cookies();

    const token = awaitedCookies.get("session")?.value;

    if (!token) {
      return { session: null, user: null };
    }

    const result = await validateSessionsToken(token);
    return result;
  },
);

export default getCurrentSession;
