import joi from 'joi'

const typeSchema = joi.object({
    type: joi
        .string()
        .valid('groceries', 'restaurant', 'transport', 'education', 'health')
        .required()
})

const passwordSchema = joi.object({
    password: joi
        .string()
        .min(4)
        .max(4)
        .pattern(/[0-9]/)
        .required(),
    securityCode: joi.string().min(3).max(3).pattern(/[0-9]/)
})

export { typeSchema, passwordSchema }