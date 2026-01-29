import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/order-actions";

async function handlePlaceOrder() {
  // const res = await createOrder();
  console.log("res");
}

function PlaceOrderButton() {
  return (
    <Button variant="default" type="submit" className="w-full">
      Place Order
    </Button>
  );
}

function PlaceOrderForm() {
  return (
    <div>
      <form onSubmit={handlePlaceOrder}>
        <PlaceOrderButton />
      </form>
    </div>
  );
}

export default PlaceOrderForm;
