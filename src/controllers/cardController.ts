import { Request, Response } from 'express'
import { TransactionTypes } from '../repositories/cardRepository.js'
import { activeCardService, createCardService } from '../services/cardService.js'

async function createCard(req: Request, res: Response) {
    const apiKey: string = res.locals.apiKey
    const { type }: { type: TransactionTypes } = req.body
    const employeeId: number = Number(req.params.employeeId)

    await createCardService(apiKey, employeeId, type)
        
    res.sendStatus(201)
}

async function activeCard(req: Request, res: Response) {
    const cardId: number = Number(req.params.cardId)
    const password: string = req.body.password

    await activeCardService(cardId, password)

    res.sendStatus(200)
}

export { createCard, activeCard }