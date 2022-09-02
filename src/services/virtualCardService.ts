import * as cardRepository from '../repositories/cardRepository.js'
import * as cardServices from '../services/cardService.js'

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
        originalCardId: isCard.id,
        type: isCard.type
    })
}

export { createVirtualCardService }