import { CardInsertData, findByTypeAndEmployeeId, insert, TransactionTypes } from "../repositories/cardRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import { Employee, findById } from "../repositories/employeeRepository.js";
import { faker } from '@faker-js/faker';
import dayjs from "dayjs";
import Cryptr from "cryptr";
import dotenv from 'dotenv'

dotenv.config()

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

async function validateCardProperties(apiKey: string, employeeId: number, type: TransactionTypes): Promise<Employee> {
    const isCompanyApiKey: object = await findByApiKey(apiKey)

    if(!isCompanyApiKey) {
        throw errorNotFound('company', 'companies')
    }

    const isEmployee: Employee = await findById(employeeId)

    if(!isEmployee) {
        throw errorNotFound('employee', 'employees')
    }

    const isCardType: object = await findByTypeAndEmployeeId(type, employeeId)

    if(isCardType) {
        throw {
            type: 'error_card_type_exists',
            message: 'This employee already have a card with this type'
        }
    }

    return isEmployee
}

export default async function cardService(apiKey: string, employeeId: number, type: TransactionTypes) {
    const { fullName: cardHolderName } = await validateCardProperties(apiKey, employeeId, type)

    const cardNumber: string = faker.finance.creditCardNumber('5### #### #### ####')
    const cardHolderNameFormatted: string = formatCardHolderName(cardHolderName) 

    const date: string[] = dayjs().format('MM/YY').split('/')
    const expirationDate: string = `${date[0]}/${Number(date[1]) + 5}`

    const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY)
    const cvc: string = cryptr.encrypt(faker.finance.creditCardCVV())

    const card: CardInsertData = {
        number: cardNumber,
        employeeId,
        cardHolderName: cardHolderNameFormatted,
        securityCode: cvc,
        expirationDate,
        isVirtual: false,
        isBlocked: false,
        type
    }

    await insert(card)
}