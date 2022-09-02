import { Request, Response } from "express";
import * as virtualCardRepository from '../services/virtualCardService.js'

async function createVirtualCard(req: Request, res: Response) {
    const cardId: number = Number(req.params.cardId)
    const password: string = req.body.password

    await virtualCardRepository.createVirtualCardService(cardId, password)

    res.sendStatus(201)
}

export { createVirtualCard }