import { Router } from 'express'
import * as cardController from '../controllers/cardController.js'
import validateSchemas from '../middlewares/validateSchemas.js'
import verifyCompanyApiKey from '../middlewares/verifyCompanyApiKey.js'

const cardRouter = Router()

cardRouter.post('/cards/:employeeId/create', verifyCompanyApiKey, validateSchemas('type'), cardController.createCard)
cardRouter.patch('/cards/:cardId/active', validateSchemas('password'), cardController.activeCard)
cardRouter.get('/cards/:cardId', cardController.cardBalanceAndTransactions) 
cardRouter.patch('/cards/:cardId/block', validateSchemas('password'), cardController.blockUnlockCard(true))  
cardRouter.patch('/cards/:cardId/unlock', validateSchemas('password'), cardController.blockUnlockCard(false))  

export default cardRouter