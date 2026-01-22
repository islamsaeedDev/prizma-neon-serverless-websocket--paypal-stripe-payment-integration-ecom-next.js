"use server";
import { auth } from "@/authConfig";
import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { handleZodAndOtherError, round2 } from "../utils";
import { prisma } from "../prisma.node";
import { cartItemScheme, insertCartSchema } from "../validator";
import { revalidatePath } from "next/cache";

//calculate cart price
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0),
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(
  data: CartItem,
): Promise<{ success: boolean; message: string }> {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("cart session not found ");
    //get  session and userId
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;
    //get what in the  cart table  by userId or  sessioCartId
    const cart = await getMyCart();
    //parse and validate item
    const item = cartItemScheme.parse(data);
    //find the added product of  cart find it in my  DB by id
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) throw new Error("product not found");

    if (!cart) {
      //Create  new cart object when cart is empty
      const newCart = insertCartSchema.parse({
        items: [item],
        userId: userId,
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });
      //add cart to  db
      await prisma.cart.create({ data: newCart });
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: "item added to the cart",
      };
    } else {
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId,
      );

      if (existItem) {
        //check stock
        if (product.stock < existItem.qty + 1) {
          return {
            success: false,
            message: "stock not available",
          };
        }

        //increase item quantity
        (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId,
        )!.qty = existItem.qty + 1;

        await prisma.cart.update({
          where: { id: cart.id },
          data: {
            ...calcPrice(cart.items as CartItem[]),
            items: cart.items as CartItem[],
          },
        });
        revalidatePath(`/product/${product.slug}`);
      } else {
        //if the item doesn`t exist in the  cart

        //push this new item to  cart
        (cart.items as CartItem[]).push(item);

        await prisma.cart.update({
          where: { id: cart.id },
          data: {
            ...calcPrice(cart.items as CartItem[]),
            items: cart.items as CartItem[],
          },
        });
        revalidatePath(`/product/${product.slug}`);
      }

      return {
        success: true,
        message: `${product.name} ${existItem ? "updated in" : "added to"} cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: handleZodAndOtherError(error),
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
// remove item  from cart
export async function removeItemFromCart(productId: string) {
  try {
    //check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    //get product form Db
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("product not found in DB");

    //get user cart
    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found");

    // cehck for  this  fuckin productId  exists in  cart table
    const exist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId,
    );
    if (!exist) throw new Error("item not found");

    //check only it is just one item in the cart
    if (exist.qty === 1) {
      //remove from cart
      cart.items = (cart.items as CartItem[]).filter(
        (x) => x.productId !== exist.productId,
      );
    } else {
      //decrease quantity
      cart.items = (cart.items as CartItem[]).map((x) =>
        x.productId === productId ? { ...x, qty: x.qty - 1 } : x,
      );
    }

    //update cart in DB
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items,
        ...calcPrice(cart.items as CartItem[]),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} was removed from cart `,
    };
  } catch (error) {
    return { success: false, message: handleZodAndOtherError(error) };
  }
}
