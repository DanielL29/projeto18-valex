import * as cardServices from '../services/cardService.js'
import * as rechargeRepository from '../repositories/rechargeRepository.js'

async function rechargeCardService(cardId: number, amount: number) {
    await cardServices.verifyCardExpiresPassword(cardId, true)

    await rechargeRepository.insert({ cardId, amount })
}

export { rechargeCardService }