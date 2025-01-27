import type { Currency } from "@/lib/constants";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CurrencyStore {
  currency: Currency;
  rate: number;
  setCurrency: (currency: Currency) => void;
  setRate: (rate: number) => void;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      currency: "USD",
      rate: 1,
      setCurrency: (currency) => set({ currency }),
      setRate: (rate) => set({ rate }),
    }),
    {
      name: "currency",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
