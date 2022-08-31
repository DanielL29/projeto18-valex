import schemas from '../../schemas/schemas.js'
import { Request, NextFunction } from 'express'
import schemasError from '../errors/schemasError'

export default function validateSchemas(schema: string): Function {
    return (req: Request, _: any, next: NextFunction) => {
        const { error } = schemas[schema].validate(req.body)

        if(error) {
            const messages: object[] = error.details.map((detail: any) => {
                return { 
                    key: detail.context.key, 
                    message: detail.message 
                }
            })

            throw schemasError(messages)
        }

        next()
    }
}