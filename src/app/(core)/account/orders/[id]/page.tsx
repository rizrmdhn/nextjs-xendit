"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCurrencyStore } from "@/stores/currency.stores";
import { currencies } from "@/lib/constants";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: "processing" | "shipped" | "delivered";
  items: OrderItem[];
}

// In a real application, you would fetch this data based on the order ID
const mockOrder: Order = {
  id: "ORD-001",
  date: "2023-06-15",
  total: 12998,
  status: "delivered",
  items: [
    { name: "Wireless Earbuds", quantity: 1, price: 9999 },
    { name: "Phone Case", quantity: 1, price: 2999 },
  ],
};

export default function OrderDetail({ params }: { params: { id: string } }) {
  const router = useRouter();

  const selectedCurrency = useCurrencyStore((state) => state.currency);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return "bg-yellow-500";
      case "shipped":
        return "bg-blue-500";
      case "delivered":
        return "bg-green-500";
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
            <CardTitle className="text-2xl font-bold">
              Order Details: {params.id}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Order Date:</h3>
                <p>{new Date(mockOrder.date).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="font-semibold">Status:</h3>
                <Badge
                  className={`${getStatusColor(mockOrder.status)} text-white`}
                >
                  {mockOrder.status.charAt(0).toUpperCase() +
                    mockOrder.status.slice(1)}
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold">Items:</h3>
                <ul className="list-inside list-disc">
                  {mockOrder.items.map((item, index) => (
                    <li key={index}>
                      {item.name} x {item.quantity} -{" "}
                      {currencies[selectedCurrency].symbol}
                      {(
                        ((item.price * item.quantity) / 100) *
                        currencies[selectedCurrency].rate
                      ).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Total:</h3>
                <p>
                  {currencies[selectedCurrency].symbol}
                  {(
                    (mockOrder.total / 100) *
                    currencies[selectedCurrency].rate
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/account/orders")}>
              Back to Orders
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
