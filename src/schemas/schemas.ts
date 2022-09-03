import { typeSchema, passwordSchema } from "./cardSchema.js"
import { amountSchema, onlineSchema } from "./transactionsSchema.js"

const schemas: object = {
    type: typeSchema,
    password: passwordSchema,
    amount: amountSchema,
    online: onlineSchema
} 

export default schemas