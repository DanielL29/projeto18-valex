import { Request, Response } from "express";
import * as virtualCardRepository from '../services/virtualCardService.js'

async function createVirtualCard(req: Request, res: Response) {
    const cardId: number = Number(req.params.cardId)
    const password: string = req.body.password

    const securityCode = await virtualCardRepository.createVirtualCardService(cardId, password)

    res.status(201).send(securityCode)
}

async function deleteVirtualCard(req: Request, res: Response) {
    const cardId: number = Number(req.params.cardId)
    const password: string = req.body.password

    await virtualCardRepository.deleteVirtualCardService(cardId, password)

    res.sendStatus(200)
}

export { createVirtualCard, deleteVirtualCard }