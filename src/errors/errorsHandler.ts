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

    if(err.type === 'error_conflict') {
        return res.status(409).send(err.message)
    }

    if(err.type === 'error_missing_schema') {
        return res.status(422).send(err.message)
    }

    if(err.type === 'error_unhautorized') {
        return res.status(401).send(err.message)
    }

    if(err.type === 'error_bad_request') {
        return res.status(400).send(err.message)
    }

    return res.status(500).send(err)
}