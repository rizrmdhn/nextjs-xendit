"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/react";
import { CheckCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const externalId = searchParams.get("externalId");

  const [data, status] = api.orders.getDetailOrders.useSuspenseQuery({
    externalId: externalId ?? "",
  });

  useEffect(() => {
    if (!externalId || (!status.isPending && !data)) {
      router.push("/shop");
    } else if (
      !status.isPending &&
      data &&
      data.status !== "PAID" &&
      data.status !== "PENDING"
    ) {
      router.push(`/account/orders/${externalId}`);
    }
  }, [externalId, status.isPending, data, router]);

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
