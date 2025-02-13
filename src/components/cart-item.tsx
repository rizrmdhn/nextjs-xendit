import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrencyStore } from "@/stores/currency.stores";
import type { Items } from "@/types/item.types";
import { Trash2 } from "lucide-react";

interface CartItemProps {
  item: Items;
  quantity: number;
  currencySymbol: string;
  currencyRate: number;
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({
  item,
  quantity,
  currencySymbol,
  currencyRate,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const selectedCurrency = useCurrencyStore((state) => state.currency);

  return (
    <div className="flex items-center justify-between border-b py-4">
      <div className="flex items-center space-x-4">
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-500">
            {currencySymbol}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: selectedCurrency,
            }).format(item.price * currencyRate)}{" "}
            each
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) =>
            onUpdateQuantity(
              item.id,
              Math.max(1, Number.parseInt(e.target.value) || 1),
            )
          }
          className="w-16 text-center"
        />
        <p className="font-semibold">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: selectedCurrency,
          }).format(item.price * quantity * currencyRate)}
        </p>
        <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
