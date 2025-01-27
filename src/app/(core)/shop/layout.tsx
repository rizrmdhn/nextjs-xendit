import { api, HydrateClient } from "@/trpc/server";

interface ShopLayoutProps {
  children: React.ReactNode;
}

export default function ShopLayout({ children }: ShopLayoutProps) {
  void api.auth.me.prefetch();
  void api.cart.cartItemCounter.prefetch();

  return <HydrateClient>{children}</HydrateClient>;
}