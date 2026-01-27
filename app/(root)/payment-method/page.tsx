import { getUserById } from "@/lib/actions/user.action";
import PaymentMethodForm from "./paymnet-method-form";
import { auth } from "@/authConfig";
import CheckoutSteps from "@/components/shared/checkout-steps";

export const metadata = {
  title: "Payment Method",
  description: "Payment Method",
};

export default async function PaymentMethod() {
  const session = await auth(),
    userId = session?.user?.id;

  if (!userId) throw new Error("user not  found");

  const user = await getUserById(userId);

  return (
    <>
      <CheckoutSteps current={2} />
      <PaymentMethodForm preferedPaymentMethod={(user as any)?.paymentMethod} />
    </>
  );
}
