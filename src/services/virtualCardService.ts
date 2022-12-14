import * as cardRepository from '../repositories/cardRepository.js'
import * as cardServices from '../services/cardService.js'
import * as errors from '../errors/errorsThrow.js'
import { Card } from '../interfaces/cardInterface.js'
import { CardInsertData } from '../types/cardTypes.js'

async function createVirtualCardService(cardId: number, password: string): Promise<Card> {
    const isCard: Card = await cardServices.verifyCardInfos(cardId, false, false)

    cardServices.decryptAndVerifyPassword(isCard.password, password)

    const { number, expirationDate, securityCode } = cardServices.generateNumberDateCvv()

    const virtualCard: CardInsertData = {
        number,
        employeeId: isCard.employeeId,
        cardholderName: isCard.cardholderName,
        securityCode,
        expirationDate,
        isVirtual: true,
        isBlocked: false,
        password: isCard.password,
        originalCardId: isCard.id,
        type: isCard.type
    }

    const { id } = await cardRepository.insert(virtualCard)

    virtualCard.securityCode = cardServices.decrypteCvv(securityCode)
    delete virtualCard.password

    return { id, ...virtualCard }
}

async function deleteVirtualCardService(cardId: number, password: string) {
    const isCard: Card = await cardServices.verifyCardInfos(cardId, false, false, false)

    if(!isCard.isVirtual) {
        throw errors.badRequest('This card is not a virtual card')
    }

    cardServices.decryptAndVerifyPassword(isCard.password, password)

    await cardRepository.remove(cardId)
}

export { createVirtualCardService, deleteVirtualCardService }