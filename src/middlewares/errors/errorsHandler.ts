import { NextFunction, Response } from 'express'

export default function errorsHandler(err: any, _: any, res: Response, next: NextFunction): Response {
    console.log(err)

    if(err.type === 'error_missing_api_key') {
        return res.status(401).send(err.message)
    }

    if(err.type === 'error_unprocessable_entity') {
        return res.status(422).send(err.messages)
    }

    if(err.type === 'error_not_found') {
        return res.status(404).send(err.message)
    }

    if(err.type === 'error_card_type_exists') {
        return res.status(409).send(err.message)
    }

    if(err.type === 'error_missing_schema') {
        return res.status(422).send(err.message)
    }

    if(err.type === 'error_card_date_expired') {
        return res.status(401).send(err.message)
    }

    if(err.type === 'error_card_already_activated') {
        return res.status(409).send(err.message)
    }

    if(err.type === 'error_cvc_invalid') {
        return res.status(401).send(err.message)
    }

    return res.status(500).send(err)
}