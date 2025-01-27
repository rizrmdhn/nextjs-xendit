"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CurrencySelector } from "@/components/currency-selector";
import AccountButton from "./account-button";
import { api } from "@/trpc/react";

export function Header() {
  const [me] = api.auth.me.useSuspenseQuery();
  const [cartItems] = api.cart.cartItemCounter.useSuspenseQuery();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          EShop
        </Link>
        <div className="flex items-center space-x-4">
          <CurrencySelector />
          <Link
            href="/cart"
            className="relative text-gray-600 hover:text-gray-800"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartItems > 0 && (
              <Badge variant="destructive" className="absolute -right-2 -top-2">
                {cartItems}
              </Badge>
            )}
          </Link>
          {!!me && <AccountButton />}
        </div>
      </div>
    </header>
  );
}
