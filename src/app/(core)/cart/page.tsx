"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { CartItem } from "@/components/cart-item";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { globalErrorToast, globalSuccessToast } from "@/lib/toast";
import { currencies } from "@/lib/constants";
import { api } from "@/trpc/react";

export default function Cart() {
  const utils = api.useUtils();

  const [cartItems] = api.cart.getCart.useSuspenseQuery();

  const [cartTotal] = api.cart.cartTotal.useSuspenseQuery();

  const [selectedCurrency, setSelectedCurrency] =
    useState<keyof typeof currencies>("USD");

  const removeItemMutation = api.cart.removeFromCart.useMutation({
    onSuccess: async () => {
      globalSuccessToast("Item removed from cart.");
      await utils.cart.getCart.invalidate();
      await utils.cart.cartTotal.invalidate();
    },
    onError: (error) => {
      globalErrorToast(error.message);
    },
  });

  const updateItemQuantityMutation = api.cart.updateItemQuantity.useMutation({
    onSuccess: async () => {
      globalSuccessToast("Item quantity updated.");
      await utils.cart.getCart.invalidate();
      await utils.cart.cartTotal.invalidate();
    },
    onError: (error) => {
      globalErrorToast(error.message);
    },
  });

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    updateItemQuantityMutation.mutate({ itemId: id, quantity: newQuantity });
  };

  const handleRemoveItem = (id: string) => {
    removeItemMutation.mutate({ itemId: id });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        isLoggedIn={true}
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        selectedCurrency={selectedCurrency}
        onSelectCurrency={(currency) =>
          setSelectedCurrency(currency as keyof typeof currencies)
        }
      />
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">Your Cart</h1>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Cart Items</CardTitle>
            </CardHeader>
            <CardContent>
              {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                cartItems.map(({ items, quantity }) => (
                  <CartItem
                    key={items.id}
                    item={items}
                    quantity={quantity}
                    currencySymbol={currencies[selectedCurrency].symbol}
                    currencyRate={currencies[selectedCurrency].rate}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between py-2">
                <span>Subtotal</span>
                <span>
                  {currencies[selectedCurrency].symbol}
                  {cartTotal * currencies[selectedCurrency].rate}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between py-2 font-semibold">
                <span>Total</span>
                <span>
                  {currencies[selectedCurrency].symbol}
                  {cartTotal * currencies[selectedCurrency].rate}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() =>
                  globalSuccessToast("Proceeded to checkout successfully.")
                }
              >
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
