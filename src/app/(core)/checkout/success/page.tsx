"use client";

import { Suspense } from "react";
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

function CheckoutSuccessContent() {
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
    <Card className="mx-auto max-w-2xl">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle className="text-3xl font-bold text-gray-800">
          Order Confirmed!
        </CardTitle>
        <CardDescription>
          Thank you for your purchase. Your order has been successfully placed.
        </CardDescription>
      </CardHeader>
      <CardContent>{/* Your commented content here */}</CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/shop")}>
          Continue Shopping
        </Button>
        <Button onClick={() => router.push("/account/orders")}>
          View Order Details
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <CheckoutSuccessContent />
        </Suspense>
      </main>
    </div>
  );
}
