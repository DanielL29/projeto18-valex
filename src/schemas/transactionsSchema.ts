import joi from 'joi'

const amountSchema = joi.object({
    amount: joi.number().min(1).required(),
    password: joi.string().min(4).max(4)
})

const onlineSchema = joi.object({
    amount: joi.number().min(1).required(),
    number: joi.string().pattern(/\b(?:\d{4}[-]){3}(?=\d{4}\b)/).required(),
    cardholderName: joi.string().required(),
    expirationDate: joi.string().pattern(/[00-99]\/[00-99]/).required(),
    securityCode: joi.string().min(3).max(3).pattern(/[0-9]/).required()
})

export { amountSchema, onlineSchema }