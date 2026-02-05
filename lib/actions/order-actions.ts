"use server";

import { auth } from "@/authConfig";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.action";
import { insertOrderSchema } from "../validator";
import { prisma } from "../prisma.node";
import { CartItem, PaymentResult } from "@/types";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObjectz, handleZodAndOtherError } from "../utils";

import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";

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
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;

    return {
      success: false,
      message: handleZodAndOtherError(error),
    };
  }
}

// function get order by ID
export async function getOrderById(orderId: string) {
  try {
    const data = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
        user: { select: { name: true, email: true } },
      },
    });

    if (!data) {
      return {
        success: false,
        message: "order not found",
      };
    }

    return {
      success: true,
      message: convertToPlainObjectz(data),
    };
  } catch (error) {
    return {
      success: false,
      message: handleZodAndOtherError(error) as unknown,
    };
  }
}

//create new paypal order

export async function createPaypalOrder(orderId: string) {
  try {
    //find order by id
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (order) {
      //create paypal order
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

      //update order with  paypal order id
      await prisma.order.update({
        where: { id: orderId },

        data: {
          paymentResult: {
            id: paypalOrder.id,
            email_address: "",
            status: "",
            pricePaid: "",
          },
        },
      });

      return {
        success: true,
        message: "paypal order created successfully",
        data: paypalOrder.id,
      };
    } else {
      return {
        success: false,
        message: "order not found",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: handleZodAndOtherError(error) as string,
    };
  }
}

//approve paypal order and update order to paid

export async function approvePaypalOrder(
  orderId: string,
  data: { orderID: string },
) {
  try {
    //get order from DB

    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });

    if (!order) throw new Error("Order not found ");

    const captureData = await paypal.captureOrder(data.orderID);

    if (
      !captureData ||
      captureData.id !== (order.paymentResult as PaymentResult)?.id ||
      captureData.status !== "COMPLETED"
    ) {
      throw new Error("Error in Paypal Payment");
    }

    //update order to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });
    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: "Order paid successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: handleZodAndOtherError(error) as string,
    };
  }
}

// update order to paid
async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult: PaymentResult;
}) {
  //get order from  DB

  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderItems: true,
    },
  });

  if (!order) throw new Error("order not found ");

  if (order.isPaid) throw new Error("Order is already Paid");

  //Transaction to Update order and account for product stock

  await prisma.$transaction(async (tx) => {
    //update order to paid

    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult: paymentResult,
      },
    });

    //account for product stock

    for (const item of order.orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.qty },
        },
      });
    }
  });
  //get updated order after  transaction

  const updatedOrder = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderItems: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!updatedOrder) throw new Error("order not found ");
}
