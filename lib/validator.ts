import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Price must be a number with at most 2 decimal places"
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
