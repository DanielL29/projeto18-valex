import joi from 'joi'

const amountSchema = joi.object({
    amount: joi.number().min(1).required(),
    password: joi.string().min(4).max(4)
})

export default amountSchema