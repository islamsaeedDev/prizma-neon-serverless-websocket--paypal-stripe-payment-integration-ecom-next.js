import { auth } from "@/authConfig";
import { getUserById } from "@/lib/actions/user.action";

import ShippingAddressForm from "./shipping-address-form";
import { ShippingAddress } from "@/types";
import CheckoutSteps from "@/components/shared/checkout-steps";

export const metadata = {
  title: "Shipping Address",
  description: "Shipping Address",
};

const ShippingAddressPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("User not found");

  const user = await getUserById(userId);

  // check that my  user data comes  from  GB as an Object :) yaa rab
  // if (!user || typeof user === "string") {
  //   redirect("/sign-in");
  // }

  return (
    <div>
      <CheckoutSteps current={1} />
      <ShippingAddressForm
        address={(user as any)?.address as ShippingAddress}
      />
    </div>
  );
};

export default ShippingAddressPage;
