import generateMetadata from "@/lib/generate-metadata";
import { api, HydrateClient } from "@/trpc/server";

interface OrderDetailLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export const metadata = generateMetadata({
  title: "Order Details",
});

export default async function OrderDetailLayout({
  children,
  params,
}: OrderDetailLayoutProps) {
  const { id } = await params;

  void api.orders.getDetailOrders.prefetch({ externalId: id });
  return <HydrateClient>{children}</HydrateClient>;
}
