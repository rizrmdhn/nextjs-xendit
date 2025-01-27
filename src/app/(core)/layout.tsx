import getCurrentSession from "@/server/auth/sessions";
import { redirect } from "next/navigation";
import type React from "react";

interface CoreLayoutProps {
  children: React.ReactNode;
}

export default async function CoreLayout({ children }: CoreLayoutProps) {
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/sign-in");
  }

  return children;
}
