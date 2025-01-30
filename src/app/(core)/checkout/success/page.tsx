"use client";

import { Suspense } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
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
import { api } from "@/trpc/react";

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const externalId = searchParams.get("externalId");

  if (!externalId) {
    redirect("/shop");
  }

  const { data } = api.orders.getDetailOrders.useQuery({
    externalId: externalId ?? "",
  });

  if (!data) {
    redirect("/shop");
  }

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
        <Button onClick={() => router.push(`/account/orders/${externalId}`)}>
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
