import { number, object, string, TypeOf } from "zod";

export const OrderSchema = object({
  body: object({
    totalAmount: number({ required_error: "Total amount is Required!" }),
    userAddress: string().optional(),
    note: string().optional(),
  }),
});

export const UpdateOrderSchema = object({
  params: object({ orderId: string() }),
  body: object({
    deliveryStatus: string().refine((v) => v === "Complete" || v === "Reject"),
  }),
});

export type OrderType = TypeOf<typeof OrderSchema>["body"];
export type UpdateOrderType = TypeOf<typeof UpdateOrderSchema>;
