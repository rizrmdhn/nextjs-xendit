// utils/xendit.ts
import { env } from "@/env";
import { Xendit } from "xendit-node";

// Use a lazy initialization pattern
let xenditInstance: Xendit | null = null;

export const getXenditClient = () => {
  // Only initialize on server and when needed
  if (typeof window === "undefined" && !xenditInstance) {
    xenditInstance = new Xendit({
      secretKey: env.XENDIT_SECRET_KEY,
    });
  }
  return xenditInstance;
};

export const getInvoiceClient = () => {
  const client = getXenditClient();
  return client?.Invoice;
};
