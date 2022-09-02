import * as cardRepository from '../repositories/cardRepository.js'
import * as cardServices from '../services/cardService.js'
import * as errors from '../errors/errorsThrow.js'

async function createVirtualCardService(cardId: number, password: string) {
    const isCard: cardRepository.Card = await cardServices.verifyCardExpiresPassword(cardId, false)

    cardServices.decryptAndVerifyPassword(isCard.password, password)

    const { number, expirationDate, securityCode } = cardServices.generateNumberDateCvv()

    await cardRepository.insert({
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
    })
}

async function deleteVirtualCardService(cardId: number, password: string) {
    const isCard: cardRepository.Card = await cardServices.verifyCardExpiresPassword(cardId, false)

    if(!isCard.isVirtual) {
        throw errors.badRequest('This card is not a virtual card')
    }

    cardServices.decryptAndVerifyPassword(isCard.password, password)

    await cardRepository.remove(cardId)
}

export { createVirtualCardService, deleteVirtualCardService }