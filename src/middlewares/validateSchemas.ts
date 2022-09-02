import schemas from '../schemas/schemas.js'
import { Request, NextFunction } from 'express'

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
            const message: object[] = error.details.map((detail: any) => detail.message).join('\n')

            throw { 
                type: 'error_unprocessable_entity', 
                message
            }
        }

        next()
    }
}