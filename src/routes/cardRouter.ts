import { Router } from 'express'
import * as cardController from '../controllers/cardController.js'
import validateSchemas from '../middlewares/validateSchemas.js'
import verifyCompanyApiKey from '../middlewares/verifyCompanyApiKey.js'

const cardRouter = Router()

cardRouter.post('/cards/:employeeId/create', verifyCompanyApiKey, validateSchemas('type'), cardController.createCard)
cardRouter.post('/cards/:cardId/active', validateSchemas('password'), cardController.activeCard)
cardRouter.get('/cards/:cardId') // balance transactions recharges
cardRouter.post('/cards/:cardId/block', validateSchemas('password'), cardController.blockUnlockCard(true))  
cardRouter.post('/cards/:cardId/unlock', validateSchemas('password'), cardController.blockUnlockCard(false))  

export default cardRouter