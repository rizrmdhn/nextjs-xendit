"use client";

import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCurrencyStore } from "@/stores/currency.stores";
import { api } from "@/trpc/react";
import type { InvoiceStatus } from "xendit-node/invoice/models";

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [invoice] = api.xendit.getDetailInvoice.useSuspenseQuery({
    externalId: id,
  });

  const selectedCurrency = useCurrencyStore((state) => state.currency);

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case "PAID":
        return "bg-green-500";
      case "EXPIRED":
        return "bg-red-500";
      case "SETTLED":
        return "bg-blue-500";
      case "PENDING":
        return "bg-yellow-500";
      case "UNKNOWN_ENUM_VALUE":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Order Details: {invoice.id ?? invoice.externalId}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Order Date:</h3>
                <p>{new Date(invoice.created).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="font-semibold">Status:</h3>
                <Badge
                  className={`${getStatusColor(invoice.status)} text-white`}
                >
                  {invoice.status.charAt(0).toUpperCase() +
                    invoice.status.slice(1)}
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold">Items:</h3>
                <ul className="list-inside list-disc">
                  {(invoice.items ?? []).map((item, index) => (
                    <li key={index}>
                      {item.name} x {item.quantity} -{" "}
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: selectedCurrency,
                      }).format(item.price * item.quantity)}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Total:</h3>
                <p>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: selectedCurrency,
                  }).format(
                    (invoice.items ?? []).reduce(
                      (acc, item) => acc + item.price * item.quantity,
                      0,
                    ),
                  )}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="gap-4">
            <Button onClick={() => router.push("/account/orders")}>
              Back to Orders
            </Button>
            {invoice.status === "PENDING" && (
              <Button
                variant="outline"
                onClick={() => {
                  window.open(invoice.invoiceUrl, "_blank");
                }}
              >
                Pay Now
              </Button>
            )}
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
