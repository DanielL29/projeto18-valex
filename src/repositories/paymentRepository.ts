import connection from "../database/db.js";

export interface Payment {
  id: number;
  cardId: number;
  businessId: number;
  timestamp: Date;
  amount: number;
}
export type PaymentWithBusinessName = Payment & { businessName: string };
export type PaymentInsertData = Omit<Payment, "id" | "timestamp">;

export async function findByCardId(cardId: number) {
  const result = await connection.query<PaymentWithBusinessName, [number]>(
    `SELECT 
      payments.*,
      businesses.name as "businessName"
     FROM payments 
      JOIN businesses ON businesses.id=payments."businessId"
     WHERE "cardId"=$1
    `,
    [cardId]
  );

  return result.rows;
}

export async function insert(paymentData: PaymentInsertData) {
  const { cardId, businessId, amount } = paymentData;

  await connection.query<any, [number, number, number]>(
    `INSERT INTO payments ("cardId", "businessId", amount) VALUES ($1, $2, $3)`,
    [cardId, businessId, amount]
  );
}

export async function balance(cardId: number) {
  const result = await connection.query<any, [number]>(`
    SELECT (
      (
        SELECT 
          COALESCE(SUM(r.amount), 0) 
        FROM recharges r 
        WHERE r."cardId" = c.id
      ) - (
        SELECT 
          COALESCE(SUM(p.amount), 0) 
        FROM payments p 
        WHERE p."cardId" = c.id
      )
    )::FLOAT AS balance
    FROM cards c 
    WHERE c.id = $1
  `, [cardId])

  return result.rows[0].balance
}