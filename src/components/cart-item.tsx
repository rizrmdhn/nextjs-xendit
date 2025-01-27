import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const formattedPrice = ((item.price / 100) * currencyRate).toFixed(2);
  const totalPrice = (((item.price * quantity) / 100) * currencyRate).toFixed(
    2,
  );

  return (
    <div className="flex items-center justify-between border-b py-4">
      <div className="flex items-center space-x-4">
        <div className="h-16 w-16 rounded-md bg-gray-200"></div>
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-500">
            {currencySymbol}
            {formattedPrice} each
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
          {currencySymbol}
          {totalPrice}
        </p>
        <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
