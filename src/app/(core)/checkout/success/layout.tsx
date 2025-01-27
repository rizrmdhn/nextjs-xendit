import generateMetadata from "@/lib/generate-metadata";

interface SuccessLayoutProps {
  children: React.ReactNode;
}

export const metadata = generateMetadata({
  title: "Success",
});

export default async function SuccessLayout({ children }: SuccessLayoutProps) {
  return children;
}
