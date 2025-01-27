"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-2xl">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <FileQuestion className="h-16 w-16 text-blue-500" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800">
              404 - Page Not Found
            </CardTitle>
            <CardDescription>
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              Please check the URL or navigate back to our homepage.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/")}>Return to Home</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
