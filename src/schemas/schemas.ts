import { typeSchema, passwordSchema } from "./cardSchema.js"
import amountSchema from "./transactionsSchema.js"

const schemas: object = {
    type: typeSchema,
    password: passwordSchema,
    amount: amountSchema
} 

export default schemas