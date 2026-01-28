import { auth } from "@/authConfig";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.action";
import { CartItem, ShippingAddress } from "@/types";
import { Table } from "@/components/ui/table";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currencyFormat } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Place Order",
  description: "Place your order",
};

const PlaceOrderPage = async () => {
  const cart = await getMyCart();

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("user not  found");

  const user = await getUserById(userId);
  if (!user) throw new Error("user not  found");

  //i want tot make sure that user is  object
  if (!user || typeof user === "string") {
    throw new Error("invalid user data");
  }

  //redirect if not found
  if (!user.address) redirect("/shipping-address");
  if (!user.paymentMethod) redirect("/payment-method");
  if (!cart || cart.items.length === 0) redirect("/cart");

  const userAddress = user.address as ShippingAddress;

  return (
    <>
      <CheckoutSteps current={3} />
      <h1 className="py-4 text-2xl font-bold">Place Order</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="md:col-span-2 overflow-x-auto space-y-4">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-lg pb-4 font-semibold">Shipping Address</h2>
              <p>{userAddress.fullName}</p>
              <p>
                {userAddress.streetAddress}, {userAddress.city}{" "}
                {userAddress.postalCode}, {userAddress.country}{" "}
              </p>
              <div className="mt-3">
                <Link href="/shipping-address">
                  <Button variant="outline">Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-lg pb-4 font-semibold">Payment Method</h2>
              <p>{user.paymentMethod}</p>

              <div className="mt-3">
                <Link href="/payment-method">
                  <Button variant="outline">Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-lg pb-4 font-semibold">Oder Items </h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(cart.items as CartItem[]).map((item) => (
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
                <div>{currencyFormat(cart.itemsPrice)}</div>
              </div>

              <div className="flex justify-between">
                <div>Shipping</div>
                <div>{currencyFormat(cart.shippingPrice)}</div>
              </div>

              <div className="flex justify-between">
                <div>Tax</div>
                <div>{currencyFormat(cart.taxPrice)}</div>
              </div>

              <div className="flex justify-between mt-2 ">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">
                  {currencyFormat(cart.totalPrice)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;
