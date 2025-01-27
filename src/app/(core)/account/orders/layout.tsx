import { api, HydrateClient } from "@/trpc/server";

interface OrderLayoutProps {
  children: React.ReactNode;
}

export default async function OrderLayout({ children }: OrderLayoutProps) {
  void api.orders.getList.prefetch();
  return <HydrateClient>{children}</HydrateClient>;
}
