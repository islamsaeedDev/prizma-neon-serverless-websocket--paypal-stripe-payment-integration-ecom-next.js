"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

import { ShippingAddress } from "@/types";
import { redirect, useRouter } from "next/navigation";
import { useTransition } from "react";
import { shippingAddressScheme } from "@/lib/validator";
import { shippingAddressDefaultValues } from "@/lib/constants";
import { ArrowRightIcon, Loader2 } from "lucide-react";
import { insertUserAddress } from "@/lib/actions/user.action";

function ShippingAddressForm({ address }: { address?: ShippingAddress }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ShippingAddress>({
    resolver: zodResolver(shippingAddressScheme),
    defaultValues: address || shippingAddressDefaultValues,
  });

  const router = useRouter();

  async function onSubmit(values: ShippingAddress) {
    startTransition(async () => {
      const res = await insertUserAddress(values);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success("Address added successfully");
      form.reset();
      router.push("/payment-method");
    });
  }

  return (
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Shipping Address</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} id="shipping-address-form">
          <FieldGroup className="gap-4">
            <Controller
              name="fullName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className="gap-2 font-light"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>

                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your Full Name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="streetAddress"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className="gap-2 font-light"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel htmlFor={field.name}>Street Address</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      placeholder="Enter your Street Address"
                      rows={3}
                      className="min-h-10 resize-none font-light"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums text-xs">
                        {field.value.length} characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="city"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="gap-2" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>City</FieldLabel>

                  <Input
                    className=" font-light"
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter City"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="country"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="gap-2" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Country</FieldLabel>

                  <Input
                    className="font-light"
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Country"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="postalCode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Postal Code</FieldLabel>

                  <Input
                    className="font-light"
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter City"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <Field orientation="horizontal" className="justify-end">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button
            type="submit"
            form="shipping-address-form"
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
  );
}

export default ShippingAddressForm;
