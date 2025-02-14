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

/**
 * Validates incoming request headers for authentication and security purposes
 * @param headers - The Headers object from the incoming request
 * @param isWebhook - Optional boolean flag to indicate if the request is a webhook (default: false)
 * @returns Promise that resolves to a Result type containing true if validation succeeds
 * @throws Error if x-callback-token is missing or invalid
 * @throws Error if x-csrf-token is missing or invalid (only when isWebhook is false)
 */
async function validateHeaders(headers: Headers, isWebhook = false) {
  return tryCatch(async () => {
    // get xendit headers
    const xenditSignature = headers.get("x-callback-token");

    if (!xenditSignature) {
      throw new Error("No signature given");
    }

    const isValid = await validateSignature(xenditSignature);

    if (!isValid) {
      throw new Error("Invalid signature");
    }

    // Only check CSRF token if not a webhook
    if (!isWebhook) {
      const csrfToken = headers.get("x-csrf-token");

      if (!csrfToken) {
        throw new Error("No CSRF token given");
      }

      const isValidCSRF = await validateCSRFToken(csrfToken);

      if (!isValidCSRF) {
        throw new Error("Invalid CSRF token");
      }
    }

    return true;
  });
}

export { validateHeaders };
