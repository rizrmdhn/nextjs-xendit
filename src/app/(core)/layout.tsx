import type React from "react";

interface CoreLayoutProps {
  children: React.ReactNode;
}

export default function CoreLayout({ children }: CoreLayoutProps) {
  return children;
}
