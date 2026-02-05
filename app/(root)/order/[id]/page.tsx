import type { Metadata } from "next";
import { getOrderById } from "@/lib/actions/order-actions";
import NotFoundPage from "@/app/not-found";
import { Order, ShippingAddress } from "@/types";
import OrderDetailsTable from "./order-details-table";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Order ${id}`,
    description: `Order ${id}`,
  };
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await getOrderById(id);
  if (!result.success) return <NotFoundPage />;
  const order = result.message;

  return (
    <div>
      <div>
        <OrderDetailsTable
          order={order as Order}
          paypalClientId={process.env.PAYPAL_CLIENT_ID || ""}
        />
      </div>
    </div>
  );
}
