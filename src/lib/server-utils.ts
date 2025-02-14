import "server-only";

import csrf from "csrf";
import { env } from "@/env";
import { tryCatch } from "./try-catch";

const tokens = new csrf();
const secret = env.CSRF_TOKEN || tokens.secretSync();

async function validateSignature(signature: string) {
  if (signature !== env.WEBHOOK_TOKEN) return false;

  return true;
}

async function validateCSRFToken(token: string) {
  if (!tokens.verify(secret, token)) return false;

  return true;
}

async function validateHeaders(headers: Headers) {
  return tryCatch(async () => {
    // get xendit headers
    const xenditSignature = headers.get("x-callback-token");

    // get csrf token
    const csrfToken = headers.get("x-csrf-token");

    if (!xenditSignature) {
      throw new Error("No signature given");
    }

    if (!csrfToken) {
      throw new Error("No CSRF token given");
    }

    const isValid = await validateSignature(xenditSignature);

    if (!isValid) {
      throw new Error("Invalid signature");
    }

    const isValidCSRF = await validateCSRFToken(csrfToken);

    if (!isValidCSRF) {
      throw new Error("Invalid CSRF token");
    }

    return true;
  });
}

export { validateHeaders };
