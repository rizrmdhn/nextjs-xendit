import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CurrencySelector } from "@/components/currency-selector";

interface HeaderProps {
  isLoggedIn: boolean;
  cartItemCount: number;
  selectedCurrency: string;
  onSelectCurrency: (currency: string) => void;
}

export function Header({
  isLoggedIn,
  cartItemCount,
  selectedCurrency,
  onSelectCurrency,
}: HeaderProps) {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          EShop
        </Link>
        <div className="flex items-center space-x-4">
          <CurrencySelector
            selectedCurrency={selectedCurrency}
            onSelectCurrency={onSelectCurrency}
          />
          <Link
            href="/cart"
            className="relative text-gray-600 hover:text-gray-800"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartItemCount > 0 && (
              <Badge variant="destructive" className="absolute -right-2 -top-2">
                {cartItemCount}
              </Badge>
            )}
          </Link>
          {isLoggedIn && (
            <Link href="/account" className="text-gray-600 hover:text-gray-800">
              <User className="h-6 w-6" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
