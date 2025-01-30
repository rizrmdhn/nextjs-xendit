"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useCurrencyStore } from "@/stores/currency.stores";
import { api } from "@/trpc/react";
import { format, formatDistance } from "date-fns";
import { id } from "date-fns/locale";
import type { InvoiceStatus } from "xendit-node/invoice/models";

export default function OrderList() {
  const selectedCurrency = useCurrencyStore((state) => state.currency);

  const [orders] = api.orders.getList.useSuspenseQuery();

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case "PAID":
        return "bg-green-500";
      case "EXPIRED":
        return "bg-red-500";
      case "SETTLED":
        return "bg-blue-500";
      case "PENDING":
        return "bg-yellow-500";
      case "UNKNOWN_ENUM_VALUE":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Your Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-4 text-center">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>
                        {format(new Date(order.createdAt), "PPP", {
                          locale: id,
                        })}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: selectedCurrency,
                        }).format(order.total)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusColor(order.status as InvoiceStatus)} text-white`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {order.status === "PAID" ? (
                          <div className="text-sm text-green-500">
                            Payment completed
                          </div>
                        ) : new Date(order.invalidTime) < new Date() ? (
                          <div className="text-sm text-red-500">Expired</div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            (
                            {formatDistance(
                              new Date(order.invalidTime),
                              new Date(),
                              {
                                addSuffix: true,
                                locale: id,
                                includeSeconds: true,
                              },
                            )}
                            )
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/account/orders/${order.externalId}`}>
                            View Details
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
