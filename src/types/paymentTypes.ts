import { Payment } from "../interfaces/paymentInterface.js";

export type PaymentWithBusinessName = Payment & { businessName: string };
export type PaymentInsertData = Omit<Payment, "id" | "timestamp">;