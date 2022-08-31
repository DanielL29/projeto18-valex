import { ErrorRequestHandler, Response } from 'express'

export default function errorsHandler(err: ErrorRequestHandler, _: any, res: Response) {
    // another errors case

    res.status(500).send(err)
}