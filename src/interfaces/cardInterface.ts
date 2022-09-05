import { TransactionTypes } from "../types/cardTypes.js";
import { PaymentWithBusinessName } from "../types/paymentTypes.js";
import { Recharge } from "./rechargeInterface.js";

export interface Card {
    id: number;
    employeeId: number;
    number: string;
    cardholderName: string;
    securityCode: string;
    expirationDate: string;
    password?: string;
    isVirtual: boolean;
    originalCardId?: number;
    isBlocked: boolean;
    type: TransactionTypes;
}

export interface BalanceTransactions {
    balance: number
    transactions: PaymentWithBusinessName[]
    recharges: Recharge[]
}