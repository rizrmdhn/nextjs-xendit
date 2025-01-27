import generateMetadata from "@/lib/generate-metadata";
import { api, HydrateClient } from "@/trpc/server";

interface ShopLayoutProps {
  children: React.ReactNode;
}

export const metadata = generateMetadata({
  title: "EShop",
});

export default function ShopLayout({ children }: ShopLayoutProps) {
  void api.item.getItems.prefetch();
  void api.cart.cartItemCounter.prefetch();

  return <HydrateClient>{children}</HydrateClient>;
}
