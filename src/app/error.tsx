"use client";

import { useEffect } from "react";
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
import { AlertCircle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-2xl">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <AlertCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800">
              Oops! Something went wrong
            </CardTitle>
            <CardDescription>
              We apologize for the inconvenience. An error occurred while
              processing your request.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              Error details: {error.message || "Unknown error"}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => router.push("/")}>
              Return to Home
            </Button>
            <Button onClick={() => reset()}>Try Again</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
