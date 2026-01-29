"use server";

import { auth } from "@/authConfig";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.action";
import { insertOrderSchema } from "../validator";
import { prisma } from "../prisma.node";
import { CartItem } from "@/types";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { handleZodAndOtherError } from "../utils";

// create order  and create  the  order items

export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error("user not found ");

    const userId = session?.user?.id;
    if (!userId) throw new Error("user not found ");

    const user = await getUserById(userId);
    if (typeof user === "string") return;

    const cart = await getMyCart();
    if (!cart || cart.items.length === 0) {
      return { success: false, message: "cart is empty", redirectTo: "/cart" };
    }

    if (!user?.address) {
      return {
        success: false,
        message: "address not found",
        redirectTo: "/shipping-address",
      };
    }
    if (!user.paymentMethod) {
      return {
        success: false,
        message: "payment method not found",
        redirectTo: "/payment-method",
      };
    }

    //create order  object with  zod validation
    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    //create a transaction as if there are  any  error  the total proceess will be  cancelled :)
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      //create order
      const insertedOrder = await tx.order.create({ data: order });

      //create order items from the cart items
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            orderId: insertedOrder.id,
            price: item.price,
          },
        });
      }

      //them  i will clear  cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0,
        },
      });

      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error("order not created");

    return {
      success: true,
      message: "order created successfully",
      orderId: insertedOrderId,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;

    return {
      success: false,
      message: handleZodAndOtherError(error),
    };
  }
}
