"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { globalErrorToast, globalSuccessToast } from "@/lib/toast";
import { api } from "@/trpc/react";
import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountButton() {
  const utils = api.useUtils();
  const router = useRouter();

  const logoutMutation = api.auth.logout.useMutation({
    onSuccess: async () => {
      globalSuccessToast("Logged out successfully");

      // Redirect to the home page
      router.push("/sign-in");

      await utils.cart.cartItemCounter.invalidate();
      await utils.auth.me.invalidate();
    },
    onError: (error) => {
      globalErrorToast(error.message);
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <User className="h-6 w-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/account/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/account/orders">Orders</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
