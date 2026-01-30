"use client";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/order-actions";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

function PlaceOrderForm() {
  const router = useRouter();

  async function handlePlaceOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await createOrder();
    if (res?.redirectTo) {
      router.push(res.redirectTo);
    }
  }

  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button
        disabled={pending}
        variant="default"
        type="submit"
        className="w-fit mt-2 font-bold"
      >
        {pending ? (
          <>
            <Loader2 className=" h-4 w-4 animate-spin" />
            Place Order...
          </>
        ) : (
          <>
            <Check className=" h-4 w-4" />
            Place Order
          </>
        )}
      </Button>
    );
  };

  return (
    <form onSubmit={handlePlaceOrder} className="w-full">
      <PlaceOrderButton />
    </form>
  );
}

export default PlaceOrderForm;
