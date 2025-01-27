"use client";

import { Header } from "@/components/header";
import { ItemCard } from "@/components/item-card";
import type { Items } from "@/types/item.types";
import { globalErrorToast, globalSuccessToast } from "@/lib/toast";
import { api } from "@/trpc/react";
import { currencies } from "@/lib/constants";
import { useCurrencyStore } from "@/stores/currency.stores";

export default function Home() {
  const utils = api.useUtils();

  const [items] = api.item.getItems.useSuspenseQuery();

  const selectedCurrency = useCurrencyStore((state) => state.currency);

  const addToCartMutation = api.cart.addToCart.useMutation({
    onSuccess: async (_data, variables) => {
      globalSuccessToast(
        `Added ${variables.quantity} ${variables.name} to the cart.`,
      );

      await utils.cart.cartItemCounter.invalidate();
      await utils.cart.getCart.invalidate();
    },
    onError: (error) => {
      globalErrorToast(error.message);
    },
  });

  const handleAddToCart = (item: Items, quantity: number) => {
    addToCartMutation.mutate({
      name: item.name,
      itemId: item.id,
      quantity,
    });
  };

  const handleBuyNow = (item: Items, quantity: number) => {
    addToCartMutation.mutate({
      name: item.name,
      itemId: item.id,
      quantity,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">Our Products</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.length === 0 ? (
            <p className="col-span-full text-center text-gray-600">
              No items available.
            </p>
          ) : (
            items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                currencyRate={currencies[selectedCurrency].rate}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
