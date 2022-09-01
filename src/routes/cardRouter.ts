import { Router } from 'express'
import { activeCard, blockCard, createCard } from '../controllers/cardController.js'
import validateSchemas from '../middlewares/validateSchemas.js'
import verifyCompanyApiKey from '../middlewares/verifyCompanyApiKey.js'

const cardRouter = Router()

cardRouter.post('/cards/:employeeId/create', verifyCompanyApiKey, validateSchemas('type'), createCard)
cardRouter.post('/cards/:cardId/active', validateSchemas('password'), activeCard)
cardRouter.get('/cards/:cardId') // balance transactions recharges
cardRouter.post('/cards/:cardId/block', validateSchemas('password'), blockCard)  

export default cardRouter