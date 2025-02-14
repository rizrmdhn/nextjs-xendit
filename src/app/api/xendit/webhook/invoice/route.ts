import {
  getWebhookOrderByExternalId,
  updateOrderByExternalIdStatus,
} from "@/server/queries/orders.queries";
import { type XenditInvoiceWebhookRequest } from "@/types/webhook.types";
import { type NextRequest } from "next/server";
import { type InvoiceStatus } from "xendit-node/invoice/models";
import { validateHeaders } from "@/lib/server-utils";

async function POST(req: NextRequest) {
  const res = await validateHeaders(req.headers);

  if (res.error) {
    return Response.json({ message: res.errorMessage }, { status: 400 });
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
  const res = await validateHeaders(req.headers);

  if (res.error) {
    return Response.json({ message: res.errorMessage }, { status: 400 });
  }

  return Response.json({ message: "Hello World" });
}

export { POST, GET };
