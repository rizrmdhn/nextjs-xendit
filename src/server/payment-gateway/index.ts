import { env } from "@/env";
import { Xendit } from "xendit-node";

const { Invoice } = new Xendit({
  secretKey: env.XENDIT_SECRET_KEY,
});

export { Invoice };
