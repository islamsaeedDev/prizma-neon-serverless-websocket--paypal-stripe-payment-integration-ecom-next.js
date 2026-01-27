"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup } from "@/components/ui/radio-group";
import { updatePaymentMethod } from "@/lib/actions/user.action";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { paymentMethodScheme } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroupItem } from "@radix-ui/react-radio-group";
import { ArrowRightIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

function PaymentMethodForm({
  preferedPaymentMethod,
}: {
  preferedPaymentMethod: string | null;
}) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof paymentMethodScheme>>({
    resolver: zodResolver(paymentMethodScheme),

    defaultValues: {
      type:
        typeof preferedPaymentMethod === "string" &&
        PAYMENT_METHODS.includes(preferedPaymentMethod)
          ? preferedPaymentMethod
          : DEFAULT_PAYMENT_METHOD,
    },
  });

  const onSubmit = (values: z.infer<typeof paymentMethodScheme>) => {
    startTransition(async () => {
      console.log("values", values);
      const res = await updatePaymentMethod(values);

      if (res.success) {
        toast.success(`${res.message}`);
        router.push("/place-order");
      } else {
        toast.error(`${res.message}`);
      }
    });
  };

  // ["Stripe", "Paypal", "CashOnDelivery"];

  return (
    <>
      <Card className="w-full sm:max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Payment Method </CardTitle>
          <CardDescription>Please select your payment method</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} id="payment-method-form">
            <Controller
              name="type"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldSet>
                  <RadioGroup
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <FieldLabel
                        key={method}
                        className="cursor-pointer"
                        htmlFor={`form-rhf-radiogroup-${method}`}
                      >
                        <Field
                          orientation="horizontal"
                          data-invalid={fieldState.invalid}
                        >
                          <FieldContent>
                            <FieldTitle>{method}</FieldTitle>
                          </FieldContent>

                          <RadioGroupItem
                            value={method}
                            id={`form-rhf-radiogroup-${method}`}
                            aria-invalid={fieldState.invalid}
                          />
                        </Field>
                      </FieldLabel>
                    ))}
                  </RadioGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldSet>
              )}
            />
          </form>
        </CardContent>

        <CardFooter>
          <Field orientation="horizontal" className="justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button
              type="submit"
              form="payment-method-form"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </>
  );
}

export default PaymentMethodForm;
