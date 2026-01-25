"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { currencyFormat } from "@/lib/utils";
import { Cart } from "@/types";
import { ArrowRight, Loader2, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useTransition } from "react";
import { toast } from "sonner";

function CartTable({ cart }: { cart?: Cart }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <>
      {!cart || cart.items.length === 0 ? (
        <div className="flex items-center justify-center h-[60dvh] flex-col">
          <p className="py-4 h4-bold">
            You have no items in your shopping cart.
          </p>
          <Link href="/">
            <Button variant="secondary" className="cursor-pointer">
              Continue Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid  md:grid-cols-4 gap-5 md:gap-3">
          <div className="overflow-x-auto md:col-span-3 ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart?.items?.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell className="text-center overflow-auto">
                      <Link
                        className="flex items-center gap-2"
                        target="_blank"
                        href={`/product/${item.slug}`}
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={44}
                          height={44}
                        />

                        <span className="px-2 ">{item.name}</span>
                      </Link>
                    </TableCell>

                    <TableCell className="text-center">
                      <Button
                        className="cursor-pointer px-1"
                        disabled={isPending}
                        variant="outline"
                        onClick={() => {
                          startTransition(async () => {
                            const res = await removeItemFromCart(
                              item.productId,
                            );
                            if (!res.message) {
                              toast.error("", {
                                description: res.message,
                              });
                            }
                          });
                        }}
                      >
                        {isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Minus className="w-fit" />
                        )}
                      </Button>
                      <span className="font-semibold px-2">{item.qty}</span>
                      <Button
                        className="cursor-pointer p-1"
                        disabled={isPending}
                        variant="outline"
                        onClick={() => {
                          startTransition(async () => {
                            const res = await addItemToCart(item);
                            if (!res.message) {
                              toast.error("", {
                                description: res.message,
                              });
                            }
                          });
                        }}
                      >
                        {isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">${item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent className=" gap-4">
              <div className="pb-3 text-xl flex gap-3">
                <span>
                  Subtotal ({cart.items.reduce((a, c) => a + c.qty, 0)})
                </span>
                <span className="font-bold">
                  {currencyFormat(cart.itemsPrice)}
                </span>
              </div>
              <Button
                className="w-full"
                disabled={isPending}
                onClick={() =>
                  startTransition(() => {
                    router.push("/shipping-address");
                  })
                }
              >
                {" "}
                Proceed To Checkout
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4 animate-pulse" />
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

export default CartTable;
