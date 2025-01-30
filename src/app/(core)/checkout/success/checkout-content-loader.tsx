"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutSuccessLoader() {
  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
          <Skeleton className="h-16 w-16 rounded-full" />
        </div>
        <Skeleton className="mx-auto h-8 w-3/4" />
        <div className="mt-2">
          <Skeleton className="mx-auto h-4 w-2/3" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-10 w-[140px]" />
        <Skeleton className="h-10 w-[140px]" />
      </CardFooter>
    </Card>
  );
}
