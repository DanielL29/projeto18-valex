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
import { CardInsertData, CardUpdateData, TransactionTypes } from "../types/cardTypes.js";
import { Employee } from "../interfaces/employeeInterface.js";
import { Company } from "../interfaces/companyInterface.js";
import { BalanceTransactions, Card } from "../interfaces/cardInterface.js";
import { PaymentWithBusinessName } from "../types/paymentTypes.js";
import { Recharge } from "../interfaces/rechargeInterface.js";
import { convertTimestampToDate, formatCardHolderName } from "../utils/cardUtils.js";

dotenv.config()

const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY)

async function validateCardProperties(apiKey: string, employeeId: number, type: TransactionTypes): Promise<Employee> {
    const isCompanyApiKey: Company = await companyRepository.findByApiKey(apiKey)

    if(!isCompanyApiKey) {
        throw errors.notFound('company', 'companies')
    }

    const isEmployee: Employee = await employeeRepository.findById(employeeId)

    if(!isEmployee) {
        throw errors.notFound('employee', 'employees')
    }

    const isCardType: Card = await cardRepository.findByTypeAndEmployeeId(type, employeeId)

    if(isCardType) {
        throw errors.conflict('employee', 'have a card with this type')
    }

    return isEmployee
}

function generateNumberDateCvv(): CardUpdateData {
    const cardNumber: string = faker.finance.creditCardNumber('mastercard')
    const date: string[] = dayjs().format('MM/YY').split('/')
    const expirationDate: string = `${date[0]}/${Number(date[1]) + 5}`
    const cvc: string = cryptr.encrypt(faker.finance.creditCardCVV())

    return { number: cardNumber, expirationDate, securityCode: cvc }
}

function decrypteCvv(cvv: string): string {
    return cryptr.decrypt(cvv)
}

async function createCardService(apiKey: string, employeeId: number, type: TransactionTypes): Promise<Card> {
    const { fullName: cardHolderName } = await validateCardProperties(apiKey, employeeId, type)

    const cardHolderNameFormatted: string = formatCardHolderName(cardHolderName) 
    
    const { number, expirationDate, securityCode } = generateNumberDateCvv()

    const card: CardInsertData = {
        number,
        employeeId,
        cardholderName: cardHolderNameFormatted,
        securityCode,
        expirationDate,
        isVirtual: false,
        isBlocked: true,
        type
    }

    const { id } = await cardRepository.insert(card)

    card.securityCode = decrypteCvv(securityCode)

    return { id, ...card }
}

async function verifyCardInfos(
    cardId: number, 
    dateExpires: boolean = true, 
    password: boolean = false, 
    virtual: boolean = true
): Promise<Card> {
    const isCard: Card = await cardRepository.findById(cardId)

    if(!isCard) {
        throw errors.notFound('card', 'cards')
    }

    if(virtual) {
        if(isCard.isVirtual) {
            throw errors.unhautorized(`This is a virtual card!`)
        }
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

async function activeCardService(cardId: number, password: string, cvv: string) {
    const isCard: Card = await verifyCardInfos(cardId)

    if(isCard.password) {
        throw errors.conflict('current card has', 'been activated')
    }

    const decryptedCvv: string = decrypteCvv(isCard.securityCode)

    if(decryptedCvv !== cvv) {
        throw errors.unhautorized('Card cvv is invalid.')
    }

    const encryptedPassword: string = bcrypt.hashSync(password, 10)

    await cardRepository.update(cardId, { password: encryptedPassword })
}

async function cardBalanceTransactionsService(cardId: number): Promise<BalanceTransactions>  {
    const isCard: Card = await verifyCardInfos(cardId, false, false, false)

    if(isCard.isVirtual) {
        cardId = isCard.originalCardId
    }

    const balance: number = await paymentRepository.balance(cardId)
    let transactionsTimestamp: PaymentWithBusinessName[] = await paymentRepository.findByCardId(cardId)
    let rechargesTimestamp: Recharge[] = await rechargeRepository.findByCardId(cardId)

    const transactions = convertTimestampToDate(transactionsTimestamp)
    const recharges = convertTimestampToDate(rechargesTimestamp)

    return { balance, transactions, recharges }
}

async function blockUnlockCardService(cardId: number, password: string, block: boolean) {
    const isCard: Card = await verifyCardInfos(cardId, true, false, false)

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
    verifyCardInfos, 
    decryptAndVerifyPassword,
    generateNumberDateCvv,
    decrypteCvv
}