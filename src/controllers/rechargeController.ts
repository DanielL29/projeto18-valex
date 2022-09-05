import { Request, Response } from 'express'
import * as rechargeService from '../services/rechargeService.js'

async function recharge(req: Request, res: Response) {
    const cardId: number = Number(req.params.cardId)
    const amount: number = req.body.amount

    await rechargeService.rechargeCardService(cardId, amount)

    res.sendStatus(200)
}

export { recharge }