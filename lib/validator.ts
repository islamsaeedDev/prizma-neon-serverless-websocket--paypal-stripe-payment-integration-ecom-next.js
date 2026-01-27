import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Price must be a number with at most 2 decimal places",
  );

//product  zod schems
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  brand: z.string().min(3, "Brand must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  stock: z.coerce.number().min(0, "Stock must be at least 0"),
  images: z.array(z.string()).min(1, "product must have at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});
//44.50

//Scheme for  sign-in inputs  of user sign in

export const signInFormScheme = z.object({
  email: z.string().email("Invalid Email Address"),
  password: z.string().min(6, "password must be more than 6 chars"),
});

export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "name must be at leat 3 charachters"),
    email: z.string().email("invalid email address"),
    password: z.string().min(6, "password must be at  least 6 charchters"),
    confirmPassword: z
      .string()
      .min(6, "confirm password must be more than 6 chars"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password don`t match",
    path: ["confirmPassword"],
  });

//cart schema
export const cartItemScheme = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is  required"),
  slug: z.string().min(1, "Slug Is Required"),
  qty: z.number().int().nonnegative("Quantity must be a non-negative number"),
  image: z.string().min(1, "image is required"),
  price: currency,
});
//insert cart schema
export const insertCartSchema = z.object({
  id: z.string().optional(),
  items: z.array(cartItemScheme),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  sessionCartId: z.string().min(1, "session cart is  required "),
  userId: z.string().optional().nullable(),
});
//schema validation for  shipping address
export const shippingAddressScheme = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  streetAddress: z.string().min(3, "Address must be at least 3 characters"),
  city: z.string().min(3, "City must be at least 3 characters"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  country: z.string().min(3, "Country must be at least 3 characters"),
  lat: z.string().optional(),
  lng: z.string().optional(),
});

//schema for payment methid

export const paymentMethodScheme = z
  .object({
    type: z.string().min(1, "payment method is required"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Invalid payment method",
  });

//schema for inserting order

export const insertOrderSchema = z.object({
  userId: z.string().min(1, "User is required"),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,

  shippingAddress: shippingAddressScheme,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    path: ["paymentMethod"],
    message: "Invalid payment method",
  }),
});

//schema  fot inserting order item 

export const insertOrderItemSchema = z.object({

  productId: z.string(),
  qty: z.number().int().nonnegative("Quantity must be a non-negative number"),
  price: currency,
  name: z.string(),
  slug: z.string(),
  image: z.string()
})