import { Card, CardContent } from "@/components/ui/card";
import { Order } from "@/types";
import { Badge } from "@/components/ui/badge";
import { currencyFormat, formatDateTime, formatId } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";

function OrderDetailsTable({ order }: { order: Order }) {
  const {
    id,
    paymentMethod,
    isPaid,
    paidAt,
    shippingAddress,
    isDelivered,
    deliveredAt,
    orderItems,
  } = order;
  return (
    <>
      <h1 className="py-4 text-2xl font-semibold">Order : {formatId(id)}</h1>
      <div className="grid md:grid-cols-3 md:gap-5 gap-2">
        <div className="col-span-2 space-y-5 overflow-x-auto">
          <Card>
            <CardContent className="p-2 gap-4">
              <h2 className="text-xl pb-4 font-semibold">Payment Method</h2>

              <div className="flex items-center gap-2">
                <p>{paymentMethod}</p>
                {isPaid ? (
                  <Badge variant="secondary">
                    Paid at {formatDateTime(paidAt!).formattedDateTime}
                  </Badge>
                ) : (
                  <Badge variant="destructive">Not Paid</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-2 gap-4">
              <h2 className="text-xl pb-4 font-semibold">Shipping Address</h2>

              <div className="flex items-center gap-2">
                <p>{shippingAddress.fullName}</p>

                <p>
                  {shippingAddress.streetAddress},{shippingAddress.city},
                  {shippingAddress.postalCode},{shippingAddress.country}
                </p>

                {isDelivered ? (
                  <Badge variant="secondary">
                    Delivered {formatDateTime(deliveredAt!).formattedDateTime}
                  </Badge>
                ) : (
                  <Badge variant="destructive">Not Delivered</Badge>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2 gap-4">
              <h2 className="text-xl pb-4 font-semibold">Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          className="flex items-center gap-1"
                          href={`/product/${item.slug}`}
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className="px-2"> {item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-center">
                        <span>{item.qty}</span>
                      </TableCell>
                      <TableCell className="text-right">{item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-3 gap-4">
              <h2 className="text-lg pb-4 font-semibold">Order Summary</h2>
              <div className="flex justify-between">
                <div>Items</div>
                <div>{currencyFormat(order.itemsPrice)}</div>
              </div>

              <div className="flex justify-between">
                <div>Shipping</div>
                <div>{currencyFormat(order.shippingPrice)}</div>
              </div>

              <div className="flex justify-between">
                <div>Tax</div>
                <div>{currencyFormat(order.taxPrice)}</div>
              </div>

              <div className="flex justify-between mt-2 ">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">
                  {currencyFormat(order.totalPrice)}
                </span>
              </div>
              {/* place  orde f0rm  */}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default OrderDetailsTable;
