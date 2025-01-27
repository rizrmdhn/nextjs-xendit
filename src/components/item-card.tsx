import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import type { Items } from "@/types/item.types";
import { format } from "date-fns";
import { useCurrencyStore } from "@/stores/currency.stores";
import { api } from "@/trpc/react";

interface ItemCardProps {
  item: Items;
  onAddToCart: (item: Items, quantity: number) => void;
  onBuyNow: (item: Items, quantity: number) => void;
  currencyRate: number;
}

export function ItemCard({
  item,
  onAddToCart,
  onBuyNow,
  currencyRate,
}: ItemCardProps) {
  const { data: me } = api.auth.me.useQuery();

  const selectedCurrency = useCurrencyStore((state) => state.currency);

  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-normal break-words text-gray-600">
          {item.description}
        </p>
        <p className="mt-2 text-2xl font-bold text-gray-800">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: selectedCurrency,
          }).format(item.price * currencyRate)}
        </p>
        <div className="mt-4 text-sm text-gray-500">
          <p>Created: {format(item.createdAt, "yyyy-MM-dd")}</p>
          {item.updatedAt && (
            <p>Updated: {format(item.updatedAt, "yyyy-MM-dd")}</p>
          )}
        </div>
        {!!me && (
          <div className="mt-4 flex items-center">
            <Button variant="outline" size="icon" onClick={decrementQuantity}>
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))
              }
              className="mx-2 w-16 text-center"
            />
            <Button variant="outline" size="icon" onClick={incrementQuantity}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
      {!!me && (
        <CardFooter className="flex justify-between">
          <Button onClick={() => onAddToCart(item, quantity)} variant="outline">
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
          <Button onClick={() => onBuyNow(item, quantity)}>Buy Now</Button>
        </CardFooter>
      )}
    </Card>
  );
}
