"use client";

import { useState, useEffect } from "react";
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
import type { Items } from "@/types/item.types";
import { globalSuccessToast } from "@/lib/toast";

const currencies = {
  USD: { symbol: "$", rate: 1 },
  EUR: { symbol: "€", rate: 0.92 },
  GBP: { symbol: "£", rate: 0.79 },
  JPY: { symbol: "¥", rate: 143.08 },
};

export default function Cart() {
  const [cartItems, setCartItems] = useState<
    { item: Items; quantity: number }[]
  >([]);
  const [selectedCurrency, setSelectedCurrency] =
    useState<keyof typeof currencies>("USD");

  // In a real app, you'd fetch the cart items from an API or local storage
  useEffect(() => {
    // Simulating fetched cart items
    setCartItems([
      {
        item: {
          id: "1",
          name: "Wireless Earbuds",
          description: "High-quality wireless earbuds",
          price: 9999,
          createdAt: "",
          updatedAt: "",
        },
        quantity: 2,
      },
      {
        item: {
          id: "2",
          name: "Smart Watch",
          description: "Feature-packed smartwatch",
          price: 19999,
          createdAt: "",
          updatedAt: "",
        },
        quantity: 1,
      },
    ]);
  }, []);

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((cartItem) =>
        cartItem.item.id === id
          ? { ...cartItem, quantity: newQuantity }
          : cartItem,
      ),
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((cartItem) => cartItem.item.id !== id),
    );
    globalSuccessToast("Item removed from cart.");
  };

  const totalPrice = cartItems.reduce(
    (sum, { item, quantity }) => sum + item.price * quantity,
    0,
  );
  const formattedTotalPrice = (
    (totalPrice / 100) *
    currencies[selectedCurrency].rate
  ).toFixed(2);

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
                cartItems.map(({ item, quantity }) => (
                  <CartItem
                    key={item.id}
                    item={item}
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
                  {formattedTotalPrice}
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
                  {formattedTotalPrice}
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
