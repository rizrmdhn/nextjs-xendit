import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const currencies = [
  { label: "USD", symbol: "$", rate: 1 },
  { label: "EUR", symbol: "€", rate: 0.92 },
  { label: "GBP", symbol: "£", rate: 0.79 },
  { label: "JPY", symbol: "¥", rate: 143.08 },
  { label: "CNY", symbol: "¥", rate: 6.47 },
  { label: "IDR", symbol: "Rp", rate: 14152.5 },
];

export function CurrencySelector({
  selectedCurrency,
  onSelectCurrency,
}: {
  selectedCurrency: string;
  onSelectCurrency: (currency: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[100px] justify-between"
        >
          {selectedCurrency}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[100px] p-0">
        <Command>
          <CommandInput placeholder="Search currency..." />
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup>
              {currencies.map((currency) => (
                <CommandItem
                  key={currency.label}
                  onSelect={() => {
                    onSelectCurrency(currency.label);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCurrency === currency.label
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {currency.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
