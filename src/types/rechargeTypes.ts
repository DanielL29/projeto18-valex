import { Recharge } from "../interfaces/rechargeInterface.js";

export type RechargeInsertData = Omit<Recharge, "id" | "timestamp">;