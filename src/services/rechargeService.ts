import * as cardServices from '../services/cardService.js'
import * as errors from '../errors/errorsThrow.js'
import * as rechargeRepository from '../repositories/rechargeRepository.js'

async function rechargeCardService(cardId: number, amount: number) {
    const isCard = await cardServices.verifyCardAndExpires(cardId)

    if(!isCard.password) {
        throw errors.unhautorized('This card has not been actived yet')
    }

    await rechargeRepository.insert({ cardId, amount })
}

export { rechargeCardService }