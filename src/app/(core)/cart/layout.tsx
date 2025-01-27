import generateMetadata from "@/lib/generate-metadata";
import { api, HydrateClient } from "@/trpc/server";

interface CartLayoutProps {
  children: React.ReactNode;
}

export const metadata = generateMetadata({
  title: "Cart",
});

export default function CartLayout({ children }: CartLayoutProps) {
  void api.cart.getCart.prefetch();
  void api.cart.cartTotal.prefetch();
  return <HydrateClient>{children}</HydrateClient>;
}
