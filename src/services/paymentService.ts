import * as cardServices from '../services/cardService.js'
import * as errors from '../errors/errorsThrow.js'
import * as businessRepository from '../repositories/businessRepository.js'
import * as cardRepository from '../repositories/cardRepository.js'
import * as paymentRepository from '../repositories/paymentRepository.js'

async function paymentPosService(cardId: number, businessId: number, amount: number, password: string) {
    const isCard: cardRepository.Card = await cardServices.verifyCardExpiresPassword(cardId, true)

    if(isCard.isBlocked) {
        throw errors.unhautorized('This card is blocked')
    }

    cardServices.decryptPassword(isCard.password, password)

    const isBusiness: businessRepository.Business = await businessRepository.findById(businessId)

    if(!isBusiness) {
        throw errors.notFound('business', 'businesses')
    }

    if(isBusiness.type !== isCard.type) {
        throw errors.badRequest('Card type is different from business type')
    }

    const balance: number = await paymentRepository.balance(cardId)

    if(balance < amount) {
        throw errors.badRequest('Insufficient balance')
    }

    await paymentRepository.insert({ cardId, businessId, amount })
}

export { paymentPosService }