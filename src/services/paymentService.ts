import * as cardServices from '../services/cardService.js'
import * as errors from '../errors/errorsThrow.js'
import * as businessRepository from '../repositories/businessRepository.js'
import * as cardRepository from '../repositories/cardRepository.js'
import * as paymentRepository from '../repositories/paymentRepository.js'
import Cryptr from 'cryptr'
import dotenv from 'dotenv'

dotenv.config()

const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY)

async function validateBusinessAndType(type: cardRepository.TransactionTypes, businessId: number) {
    const isBusiness: businessRepository.Business = await businessRepository.findById(businessId)

    if(!isBusiness) {
        throw errors.notFound('business', 'businesses')
    }

    if(isBusiness.type !== type) {
        throw errors.badRequest('Card type is different from business type')
    }
}

async function verifyBlockBalance(isBlocked: boolean, cardId: number, amount: number) {
    const balance: number = await paymentRepository.balance(cardId)

    if(isBlocked) {
        throw errors.unhautorized('This card is blocked')
    }

    if(balance < amount) {
        throw errors.badRequest('Insufficient balance')
    }
}

async function paymentPosService(cardId: number, businessId: number, amount: number, password: string) {
    const isCard: cardRepository.Card = await cardServices.verifyCardInfos(cardId, true, true)

    if(isCard.isBlocked) {
        throw errors.unhautorized('This card is blocked')
    }

    cardServices.decryptAndVerifyPassword(isCard.password, password)

    await validateBusinessAndType(isCard.type, businessId)
    await verifyBlockBalance(isCard.isBlocked, cardId, amount)

    await paymentRepository.insert({ cardId, businessId, amount })
}

async function paymentOnlineService(cardId: number, businessId: number, virtualCard: cardRepository.VirtualCard) {
    const { amount, cardholderName, number, securityCode, expirationDate } = virtualCard

    const isCard: cardRepository.Card = await cardServices.verifyCardInfos(cardId, true, true, false)

    const decryptedCvv = cryptr.decrypt(isCard.securityCode)

    if(isCard.cardholderName !== cardholderName 
    || isCard.number !== number 
    || decryptedCvv !== securityCode 
    || isCard.expirationDate !== expirationDate) {
        throw errors.badRequest("Invalid credentials! this credentials doesn't match with virtual card credentials")
    }

    await validateBusinessAndType(isCard.type, businessId)
    await verifyBlockBalance(isCard.isBlocked, isCard.originalCardId, amount)

    await paymentRepository.insert({ cardId: isCard.originalCardId, businessId, amount })
}

export { paymentPosService, paymentOnlineService }