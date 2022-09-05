import { Response, Request } from 'express'
import * as paymentService from '../services/paymentService.js'
import { VirtualCard } from '../types/cardTypes.js'

async function paymentPos(req: Request, res: Response) {
    const cardId: number = Number(req.params.cardId)
    const businessId: number = Number(req.params.businessId)
    const { amount, password }: { amount: number, password: string } = req.body 

    await paymentService.paymentPosService(cardId, businessId, amount, password)

    res.sendStatus(200)
}

async function paymentOnline(req: Request, res: Response) {
    const cardId: number = Number(req.params.cardId)
    const businessId: number = Number(req.params.businessId)
    const virtualCard: VirtualCard = req.body

    await paymentService.paymentOnlineService(cardId, businessId, virtualCard)

    res.sendStatus(200)
}

export { paymentPos, paymentOnline }