import z from "zod";
import {
  cartItemScheme,
  insertCartSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  insertProductSchema,
  paymentResultSchema,
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

export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderItems: OrderItem[];
  user: { name: string; email: string };
};

export type PaymentResult = z.infer<typeof paymentResultSchema>;
