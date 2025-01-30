import { Suspense } from "react";
import { Header } from "@/components/header";
import CheckoutSuccessContent from "./checkout-content";
import { api, HydrateClient } from "@/trpc/server";
import CheckoutSuccessLoader from "./checkout-content-loader";

interface CheckoutSuccessProps {
  searchParams: Promise<{ externalId: string }>;
}

export default async function CheckoutSuccess({
  searchParams,
}: CheckoutSuccessProps) {
  const { externalId } = await searchParams;

  void api.orders.getDetailOrders.prefetch({ externalId });

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <HydrateClient>
          <Suspense fallback={<CheckoutSuccessLoader />}>
            <CheckoutSuccessContent />
          </Suspense>
        </HydrateClient>
      </main>
    </div>
  );
}
