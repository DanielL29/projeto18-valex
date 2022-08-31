import { Request, Response } from 'express'
import { TransactionTypes } from '../repositories/cardRepository.js'
import cardService from '../services/cardService.js'

async function createCard(req: Request, res: Response) {
    const apiKey: string = res.locals.apiKey
    const { type }: { type: TransactionTypes } = req.body
    const employeeId: number = Number(req.params.employeeId)

    await cardService(apiKey, employeeId, type)
        
    res.sendStatus(201)
}

export { createCard }