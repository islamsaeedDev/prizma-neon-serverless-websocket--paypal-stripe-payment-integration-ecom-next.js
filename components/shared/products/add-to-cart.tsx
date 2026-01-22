"use client";
import { Cart, CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Minus } from "lucide-react";
import { useTransition } from "react";

interface AddToCartProps {
  cart?: Cart;
  item: CartItem;
}
function AddToCart({ cart, item }: AddToCartProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  async function handleAddToCart() {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast.error("", {
          description: (
            <span className="text-red-500 font-medium">
              {res.message as string}
            </span>
          ),
        });
        router.refresh();
      } else {
        //handle  success
        toast.success("", {
          description: (
            <span className="font-medium">{res.message as string}</span>
          ),
          action: {
            label: "View Cart",
            onClick: () => router.push("/cart"),
          },
        });
      }
    });
  }

  //check if item exist in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  async function handleRemoveItemFromCart() {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      if (!res.success) {
        toast.error("", {
          description: (
            <span className="text-red-500 font-medium">
              {res.message as string}
            </span>
          ),
        });
        router.refresh();
      } else {
        //handle  success
        toast.success("", {
          description: (
            <span className="font-medium">{res.message as string}</span>
          ),
          action: {
            label: "View Cart",
            onClick: () => router.push("/cart"),
          },
        });
      }
    });
  }

  return existItem ? (
    <div>
      <Button
        type="button"
        variant="outline"
        onClick={handleRemoveItemFromCart}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button type="button" variant="outline" onClick={handleAddToCart}>
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button type="button" onClick={handleAddToCart}>
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <PlusCircle className="mr-2 h-4 w-4" />
      )}
      Add To Cart
    </Button>
  );
}

export default AddToCart;
