import schemas from '../../schemas/schemas.js'
import { Request, NextFunction } from 'express'
import schemasError from '../errors/schemasError.js'

export default function validateSchemas(schema: string) {
    if(!schemas.hasOwnProperty(schema)) {
        throw {
            type: 'error_missing_schema',
            message: 'Any schema was passed in function'
        }
    }

    return (req: Request, _: any, next: NextFunction) => {
        const { error } = schemas[schema].validate(req.body, { abortEarly: false })

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