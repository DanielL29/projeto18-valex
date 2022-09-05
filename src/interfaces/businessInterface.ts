import { TransactionTypes } from "../types/cardTypes.js";

export interface Business {
    id: number;
    name: string;
    type: TransactionTypes;
}