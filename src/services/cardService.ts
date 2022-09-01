import * as cardRepository from "../repositories/cardRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import { faker } from '@faker-js/faker';
import dayjs from "dayjs";
import Cryptr from "cryptr";
import dotenv from 'dotenv'
import * as errors from "../errors/errorsThrow.js";

dotenv.config()

const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY)

function formatCardHolderName(name: string): string {
    const upperNameArray: string[] = name.toUpperCase().split(' ')

    return upperNameArray
        .filter((name, i) => i === 0 || i === upperNameArray.length - 1 || name.length >= 3)
        .map((name, i, array) => i !== 0 && i !== array.length - 1 ? name[0] : name)
        .join(' ')
} 

async function validateCardProperties(apiKey: string, employeeId: number, type: cardRepository.TransactionTypes): Promise<employeeRepository.Employee> {
    const isCompanyApiKey: companyRepository.Company = await companyRepository.findByApiKey(apiKey)

    if(!isCompanyApiKey) {
        throw errors.notFound('company', 'companies')
    }

    const isEmployee: employeeRepository.Employee = await employeeRepository.findById(employeeId)

    if(!isEmployee) {
        throw errors.notFound('employee', 'employees')
    }

    const isCardType: cardRepository.Card = await cardRepository.findByTypeAndEmployeeId(type, employeeId)

    if(isCardType) {
        throw errors.conflict('employee', 'have a card with this type')
    }

    return isEmployee
}

async function createCardService(apiKey: string, employeeId: number, type: cardRepository.TransactionTypes) {
    const { fullName: cardHolderName } = await validateCardProperties(apiKey, employeeId, type)

    const cardNumber: string = faker.finance.creditCardNumber('5### #### #### ####')
    const cardHolderNameFormatted: string = formatCardHolderName(cardHolderName) 

    const date: string[] = dayjs().format('MM/YY').split('/')
    const expirationDate: string = `${date[0]}/${Number(date[1]) + 5}`

    const cvc: string = cryptr.encrypt(faker.finance.creditCardCVV())

    const card: cardRepository.CardInsertData = {
        number: cardNumber,
        employeeId,
        cardHolderName: cardHolderNameFormatted,
        securityCode: cvc,
        expirationDate,
        isVirtual: false,
        isBlocked: false,
        type
    }

    await cardRepository.insert(card)
}

async function verifyCardAndExpires(cardId: number): Promise<cardRepository.Card> {
    const isCard: cardRepository.Card = await cardRepository.findById(cardId)

    if(!isCard) {
        throw errors.notFound('card', 'cards')
    }

    const dateNow: string = dayjs().format('MM/YY')
    const isDateExpired: number = dayjs(dateNow).diff(isCard.expirationDate, 'month')

    if(isDateExpired > 0) {
        throw errors.unhautorized('Current card has expired.')
    }

    return isCard
}

async function activeCardService(cardId: number, password: string) {
    const isCard = await verifyCardAndExpires(cardId)

    if(isCard.password) {
        throw errors.conflict('current card has', 'been activated')
    }

    const cvcDescrypted: string = cryptr.decrypt(isCard.securityCode)

    if(cvcDescrypted.length !== 3 || !cvcDescrypted) {
        throw errors.unhautorized('Card cvv is invalid.')
    }

    const encryptedPassword: string = cryptr.encrypt(password)

    await cardRepository.update(cardId, { password: encryptedPassword })
}

async function balanceTransactionsRechargesService() {

}

async function blockUnlockCardService(cardId: number, password: string, block: boolean) {
    const isCard = await verifyCardAndExpires(cardId)

    if(block) {
        if(isCard.isBlocked) {
            throw errors.conflict('card is', 'blocked')
        }
    } else if(!block) {
        if(!isCard.isBlocked) {
            throw errors.conflict('card is', 'unlocked')
        }
    }
    
    const decryptedPassword = cryptr.decrypt(isCard.password)

    if(decryptedPassword !== password) {
        throw errors.unhautorized('Wrong card password.')
    }

    await cardRepository.update(cardId, { isBlocked: block })
}

export { createCardService, activeCardService, balanceTransactionsRechargesService, blockUnlockCardService, verifyCardAndExpires }