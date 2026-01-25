import { getMyCart } from "@/lib/actions/cart.actions";
import CartTable from "./cart-table";
import { Cart } from "@/types";

export const metadata = {
  title: "Shopping Cart",
};

async function CartPage() {
  const cart = await getMyCart();
  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      <CartTable cart={cart as Cart} />
    </>
  );
}

export default CartPage;
