"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { ItemCard } from "@/components/item-card";
import type { Items } from "@/types/item.types";
import { globalSuccessToast } from "@/lib/toast";
import { api } from "@/trpc/react";
import { currencies } from "@/lib/constants";

export default function Home() {
  const isLoggedIn = true;

  const [items] = api.item.getItems.useSuspenseQuery();

  const [cartItems, setCartItems] = useState<
    { item: Items; quantity: number }[]
  >([]);
  const [selectedCurrency, setSelectedCurrency] =
    useState<keyof typeof currencies>("USD");

  const handleAddToCart = (item: Items, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.item.id === item.id,
      );
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem,
        );
      } else {
        return [...prevItems, { item, quantity }];
      }
    });
    globalSuccessToast(`Added ${quantity} ${item.name} to the cart.`);
  };

  const handleBuyNow = (item: Items, quantity: number) => {
    setCartItems([{ item, quantity }]);
    globalSuccessToast(`Bought ${quantity} ${item.name}.`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        isLoggedIn={isLoggedIn}
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        selectedCurrency={selectedCurrency}
        onSelectCurrency={(currency) =>
          setSelectedCurrency(currency as keyof typeof currencies)
        }
      />
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
                currencySymbol={currencies[selectedCurrency].symbol}
                currencyRate={currencies[selectedCurrency].rate}
                isLoggedIn={isLoggedIn}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
