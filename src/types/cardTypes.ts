import { Card } from "../interfaces/cardInterface.js";

export type TransactionTypes =
  | "groceries"
  | "restaurant"
  | "transport"
  | "education"
  | "health";

export type CardInsertData = Omit<Card, "id">;
export type CardUpdateData = Partial<Card>;
export type VirtualCard = CardUpdateData & { amount: number }