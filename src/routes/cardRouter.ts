import { Router } from 'express'
import { createCard } from '../controllers/cardController.js'
import validateSchemas from '../middlewares/validations/validateSchemas.js'
import verifyCompanyApiKey from '../middlewares/verifyCompanyApiKey.js'

const cardRouter = Router()

cardRouter.post('/cards/:employeeId/create', verifyCompanyApiKey, validateSchemas('card'), createCard)

export default cardRouter