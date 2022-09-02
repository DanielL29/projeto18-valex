import { Router } from 'express'
import { createVirtualCard } from '../controllers/virtualCardController.js'
import validateSchemas from '../middlewares/validateSchemas.js'

const virtualCardRouter = Router()

virtualCardRouter.post('/cards/virtual/:cardId/create', validateSchemas('password'), createVirtualCard)

export default virtualCardRouter