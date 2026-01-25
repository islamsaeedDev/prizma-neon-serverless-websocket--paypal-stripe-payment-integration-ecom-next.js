import z from "zod";
import {
  cartItemScheme,
  insertCartSchema,
  insertProductSchema,
  shippingAddressScheme,
} from "@/lib/validator";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  ratting: string;
  createdAt: Date;
  updatedAt: Date;
};

//geting cart types from zod schema

export type Cart = z.infer<typeof insertCartSchema>;

export type CartItem = z.infer<typeof cartItemScheme>;

export type ShippingAddress = z.infer<typeof shippingAddressScheme>;
