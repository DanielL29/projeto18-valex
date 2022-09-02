import * as cardServices from '../services/cardService.js'
import * as errors from '../errors/errorsThrow.js'
import * as businessRepository from '../repositories/businessRepository.js'
import * as cardRepository from '../repositories/cardRepository.js'
import * as paymentRepository from '../repositories/paymentRepository.js'

async function validateBusinessAndType(type: cardRepository.TransactionTypes, businessId: number) {
    const isBusiness: businessRepository.Business = await businessRepository.findById(businessId)

    if(!isBusiness) {
        throw errors.notFound('business', 'businesses')
    }

    if(isBusiness.type !== type) {
        throw errors.badRequest('Card type is different from business type')
    }
}

async function paymentPosService(cardId: number, businessId: number, amount: number, password: string) {
    const isCard: cardRepository.Card = await cardServices.verifyCardExpiresPassword(cardId, true, true)

    if(isCard.isBlocked) {
        throw errors.unhautorized('This card is blocked')
    }

    cardServices.decryptAndVerifyPassword(isCard.password, password)

    await validateBusinessAndType(isCard.type, businessId)

    const balance: number = await paymentRepository.balance(cardId)

    if(balance < amount) {
        throw errors.badRequest('Insufficient balance')
    }

    await paymentRepository.insert({ cardId, businessId, amount })
}

export { paymentPosService }