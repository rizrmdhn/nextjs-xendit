import {
  getWebhookOrderByExternalId,
  updateOrderByExternalIdStatus,
} from "@/server/queries/orders.queries";
import { type XenditInvoiceWebhookRequest } from "@/types/webhook.types";
import { type NextRequest } from "next/server";
import { type InvoiceStatus } from "xendit-node/invoice/models";

async function validateSignature(signature: string) {
  if (signature !== process.env.WEBHOOK_TOKEN) return false;

  return true;
}

async function POST(req: NextRequest) {
  // get xendit headers
  const xenditSignature = req.headers.get("x-callback-token");

  if (!xenditSignature) {
    return Response.json({ message: "No signature given" }, { status: 401 });
  }

  const isValid = await validateSignature(xenditSignature);

  if (!isValid) {
    return Response.json({ message: "Invalid signature" }, { status: 401 });
  }

  const requestJson = (await req.json()) as XenditInvoiceWebhookRequest;

  // check if order exists
  const order = await getWebhookOrderByExternalId(requestJson.external_id);

  if (!order) {
    return Response.json({ message: "Order not found" }, { status: 404 });
  }

  const status = requestJson.status as InvoiceStatus;

  const isPaid =
    status === "PAID" || status === "SETTLED" || status === "EXPIRED";

  // update order status
  await updateOrderByExternalIdStatus(
    order.externalId,
    status,
    isPaid ? true : false,
  );

  return Response.json({ message: "Order updated" });
}

async function GET(req: NextRequest) {
  // get xendit headers
  const xenditSignature = req.headers.get("x-callback-token");

  if (!xenditSignature) {
    return Response.json({ message: "No signature given" }, { status: 401 });
  }

  const isValid = await validateSignature(xenditSignature);

  if (!isValid) {
    return Response.json({ message: "Invalid signature" }, { status: 401 });
  }

  return Response.json({ message: "Hello World" });
}

export { POST, GET };
