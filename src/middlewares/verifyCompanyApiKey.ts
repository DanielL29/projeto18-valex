import { Request, Response, NextFunction } from 'express'

export default function verifyCompanyApiKey(req: Request, res: Response, next: NextFunction) {
    const apiKey: string | string[] = req.headers['x-api-key']

    if(!apiKey && apiKey === '') {
        throw {
            type: 'error_missing_api_key',
            message: 'Missing API Key'
        }
    }

    res.locals.apiKey = apiKey

    next()
}