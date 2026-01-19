"use server";

import { auth } from "@/authConfig";
import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { handleZodError } from "../utils";
import { prisma } from "../prisma.node";
import { cartItemScheme } from "../validator";

export async function addItemToCart(data: CartItem) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("cart session not found ");
    //get  session and userId
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    //get what in the  cart table  by userId or  sessioCartId
    const Cart = await getMyCart();

    //parse and validate item

    const item = cartItemScheme.parse(data);
    //find the added product of  cart find it in my  DB by id
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    console.log({
      "session Cart Id": sessionCartId,
      "all session auth": session,
      "User Id": userId,
      "Item i added to  cart  ": item,
      Cart: Cart,
      product: product,
    });

    return {
      success: true,
      message: "item added to the cart",
    };
  } catch (error) {
    return {
      success: false,
      message: handleZodError(error),
    };
  }
}
export async function getMyCart() {
  //check for the cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not found");

  //get userId  row value from our session
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;
  //get user cart  from DB
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;
  return cart;
}
