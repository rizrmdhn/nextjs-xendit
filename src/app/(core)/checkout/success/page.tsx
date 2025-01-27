"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { api } from "@/trpc/react";
import { globalErrorToast } from "@/lib/toast";

export default function CheckoutSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const externalId = searchParams.get("externalId");

  const { mutate } = api.orders.updateOrderStatus.useMutation({
    onError: (error) => {
      globalErrorToast(error.message);

      router.push("/shop");
    },
  });

  useEffect(() => {
    if (!externalId || typeof externalId !== "string") {
      router.push("/shop");
    }

    if (externalId) {
      mutate({
        externalId,
        status: "SETTLED",
      });
    }
  }, [externalId, mutate, router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-2xl">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800">
              Order Confirmed!
            </CardTitle>
            <CardDescription>
              Thank you for your purchase. Your order has been successfully
              placed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Order Number:</h3>
                <p>{orderDetails.orderId}</p>
              </div>
              <div>
                <h3 className="font-semibold">Order Summary:</h3>
                <ul className="list-inside list-disc">
                  {orderDetails.items.map((item, index) => (
                    <li key={index}>
                      {item.name} x {item.quantity} -{" "}
                      {currencies[selectedCurrency].symbol}
                      {(
                        ((item.price * item.quantity) / 100) *
                        currencies[selectedCurrency].rate
                      ).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Total:</h3>
                <p>
                  {currencies[selectedCurrency].symbol}
                  {formattedTotal}
                </p>
              </div>
            </div> */}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/shop")}>
              Continue Shopping
            </Button>
            <Button onClick={() => router.push("/account/orders")}>
              View Order Details
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
