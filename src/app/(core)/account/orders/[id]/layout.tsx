import { api, HydrateClient } from "@/trpc/server";

interface DetailOrderLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function DetailOrderLayout({
  children,
  params,
}: DetailOrderLayoutProps) {
  const { id } = await params;

  void api.xendit.getDetailInvoice.prefetch({ externalId: id });
  return <HydrateClient>{children}</HydrateClient>;
}
