import { auth } from "@/authConfig";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.action";

import { redirect } from "next/navigation";
import ShippingAddressForm from "./shipping-address-form";
import { ShippingAddress } from "@/types";

export const metadata = {
  title: "Shipping Address",
  description: "Shipping Address",
};

const ShippingAddressPage = async () => {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) redirect("/cart");

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("User not found");

  const user = await getUserById(userId);
  if (!user || typeof user === "string") {
    throw new Error("invalid user data");
  }
  return (
    <div>
      <ShippingAddressForm address={user?.address as ShippingAddress} />
    </div>
  );
};

export default ShippingAddressPage;
