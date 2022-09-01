import * as cardRepository from "../repositories/cardRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import { faker } from '@faker-js/faker';
import dayjs from "dayjs";
import Cryptr from "cryptr";
import dotenv from 'dotenv'

dotenv.config()

const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY)

function errorNotFound(err: string, errPlural: string): object {
    return {
        type: 'error_not_found',
        message: `This ${err} was not founded, it doesn't be in ${errPlural} datas`
    }
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
        throw errorNotFound('company', 'companies')
    }

    const isEmployee: employeeRepository.Employee = await employeeRepository.findById(employeeId)

    if(!isEmployee) {
        throw errorNotFound('employee', 'employees')
    }

    const isCardType: cardRepository.Card = await cardRepository.findByTypeAndEmployeeId(type, employeeId)

    if(isCardType) {
        throw {
            type: 'error_card_type_exists',
            message: 'This employee already have a card with this type'
        }
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

async function activeCardService(id: number, password: string) {
    const isCard: cardRepository.Card = await cardRepository.findById(id)

    if(!isCard) {
        throw errorNotFound('card', 'cards')
    }

    const dateNow: string = dayjs().format('MM/YY')
    const isDateExpired: number = dayjs(dateNow).diff(isCard.expirationDate, 'month')

    if(isDateExpired > 0) {
        throw {
            type: 'error_card_date_expired',
            message: 'The current card has expired'
        }
    }

    if(isCard.password) {
        throw {
            type: 'error_card_already_activated',
            message: 'The current card has already been activated'
        }
    }

    const cvcDescrypted: string = cryptr.decrypt(isCard.securityCode)

    if(cvcDescrypted.length !== 3 || !cvcDescrypted) {
        throw {
            type: 'error_cvc_invalid',
            message: 'Card cvv is invalid!'
        }
    }

    const encryptedPassword = cryptr.encrypt(password)

    await cardRepository.update(id, { password: encryptedPassword })
}

export { createCardService, activeCardService }