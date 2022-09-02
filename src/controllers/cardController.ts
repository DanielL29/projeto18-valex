import { Request, Response } from 'express'
import { TransactionTypes } from '../repositories/cardRepository.js'
import * as cardService from '../services/cardService.js'

async function createCard(req: Request, res: Response) {
    const apiKey: string = res.locals.apiKey
    const { type }: { type: TransactionTypes } = req.body
    const employeeId: number = Number(req.params.employeeId)

    await cardService.createCardService(apiKey, employeeId, type)
        
    res.sendStatus(201)
}

async function activeCard(req: Request, res: Response) {
    const cardId: number = Number(req.params.cardId)
    const password: string = req.body.password

    await cardService.activeCardService(cardId, password)

    res.sendStatus(200)
}

async function cardBalanceAndTransactions(req: Request, res: Response) {
    const cardId: number = Number(req.params.cardId)

    const balanceTransactions: cardService.BalanceTransactions = await cardService.cardBalanceTransactionsService(cardId)

    res.status(200).send(balanceTransactions)
}

function blockUnlockCard(block: boolean) {
    return async (req: Request, res: Response) => {
        const cardId: number = Number(req.params.cardId)
        const password: string = req.body.password
        
        await cardService.blockUnlockCardService(cardId, password, block)
    
        res.sendStatus(200)
    }
}

export { createCard, activeCard, cardBalanceAndTransactions, blockUnlockCard }