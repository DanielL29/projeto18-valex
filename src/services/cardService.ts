import * as cardRepository from "../repositories/cardRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import { faker } from '@faker-js/faker';
import dayjs from "dayjs";
import Cryptr from "cryptr";
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import * as errors from "../errors/errorsThrow.js";

dotenv.config()

const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY)

export interface BalanceTransactions {
    balance: number
    transactions: paymentRepository.PaymentWithBusinessName[]
    recharges: rechargeRepository.Recharge[]
}

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

function generateNumberDateCvv(): cardRepository.CardUpdateData {
    const cardNumber: string = faker.finance.creditCardNumber('mastercard')
    const date: string[] = dayjs().format('MM/YY').split('/')
    const expirationDate: string = `${date[0]}/${Number(date[1]) + 5}`
    const cvc: string = cryptr.encrypt(faker.finance.creditCardCVV())

    return { number: cardNumber, expirationDate, securityCode: cvc }
}

async function createCardService(apiKey: string, employeeId: number, type: cardRepository.TransactionTypes) {
    const { fullName: cardHolderName } = await validateCardProperties(apiKey, employeeId, type)

    const cardHolderNameFormatted: string = formatCardHolderName(cardHolderName) 
    
    const { number, expirationDate, securityCode } = generateNumberDateCvv()

    await cardRepository.insert({
        number,
        employeeId,
        cardholderName: cardHolderNameFormatted,
        securityCode,
        expirationDate,
        isVirtual: false,
        isBlocked: false,
        type
    })
}

async function verifyCardExpiresPassword(cardId: number, dateExpires: boolean = true, password: boolean = false): Promise<cardRepository.Card> {
    const isCard: cardRepository.Card = await cardRepository.findById(cardId)

    if(!isCard) {
        throw errors.notFound('card', 'cards')
    }

    if(dateExpires) {
        const dateNow: string = dayjs().format('MM/YY')
        const isDateExpired: number = dayjs(dateNow).diff(isCard.expirationDate, 'month')

        if(isDateExpired > 0) {
            throw errors.unhautorized('Current card has expired.')
        }
    }

    if(password) {
        if(!isCard.password) {
            throw errors.badRequest('This card has not been actived yet')
        }
    }

    return isCard
}

function decryptAndVerifyPassword(encryptedPassword: string, password: string) {
    if(!bcrypt.compareSync(password, encryptedPassword)) {
        throw errors.unhautorized('Wrong card password.')
    }
}

async function activeCardService(cardId: number, password: string) {
    const isCard: cardRepository.Card = await verifyCardExpiresPassword(cardId)

    if(isCard.password) {
        throw errors.conflict('current card has', 'been activated')
    }

    const cvcDescrypted: string = cryptr.decrypt(isCard.securityCode)

    if(cvcDescrypted.length !== 3 || !cvcDescrypted) {
        throw errors.unhautorized('Card cvv is invalid.')
    }

    const encryptedPassword: string = bcrypt.hashSync(password, 10)

    await cardRepository.update(cardId, { password: encryptedPassword })
}

function convertTimestampToDate(array: any[]): any[] {
    return array.map(object => {
        return {
            ...object,
            timestamp: dayjs(object.timestamp).format('DD/MM/YYYY')
        }
    })
}

async function cardBalanceTransactionsService(cardId: number): Promise<BalanceTransactions>  {
    await verifyCardExpiresPassword(cardId, false)

    const balance: number = await paymentRepository.balance(cardId)
    let transactionsTimestamp: paymentRepository.PaymentWithBusinessName[] = await paymentRepository.findByCardId(cardId)
    let rechargesTimestamp: rechargeRepository.Recharge[] = await rechargeRepository.findByCardId(cardId)

    const transactions = convertTimestampToDate(transactionsTimestamp)
    const recharges = convertTimestampToDate(rechargesTimestamp)

    return { balance, transactions, recharges }
}

async function blockUnlockCardService(cardId: number, password: string, block: boolean) {
    const isCard: cardRepository.Card = await verifyCardExpiresPassword(cardId)

    if(block) {
        if(isCard.isBlocked) {
            throw errors.conflict('card is', 'blocked')
        }
    } else if(!block) {
        if(!isCard.isBlocked) {
            throw errors.conflict('card is', 'unlocked')
        }
    }
    
    decryptAndVerifyPassword(isCard.password, password)

    await cardRepository.update(cardId, { isBlocked: block })
}

export { 
    createCardService, 
    activeCardService, 
    cardBalanceTransactionsService, 
    blockUnlockCardService, 
    verifyCardExpiresPassword, 
    decryptAndVerifyPassword,
    generateNumberDateCvv
}