"use client";
import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addItemToCart } from "@/lib/actions/cart.actions";

function AddToCart({ item }: { item: CartItem }) {
  const router = useRouter();

  async function handleAddToCart() {
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
          <span className="font-medium">
            {`${item.name} added to cart successfully`}
          </span>
        ),
        action: {
          label: "View Cart",
          onClick: () => router.push("/cart"),
        },
      });
    }
  }

  return (
    <div>
      <Button
        type="button"
        className="w-full cursor-pointer"
        onClick={handleAddToCart}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add To Cart
      </Button>
    </div>
  );
}

export default AddToCart;
