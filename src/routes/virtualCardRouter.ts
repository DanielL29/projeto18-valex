import { Router } from 'express'
import * as virtualCardController from '../controllers/virtualCardController.js'
import validateSchemas from '../middlewares/validateSchemas.js'

const virtualCardRouter = Router()

virtualCardRouter.post('/cards/virtual/:cardId/create', validateSchemas('password'), virtualCardController.createVirtualCard)
virtualCardRouter.delete('/cards/virtual/:cardId', validateSchemas('password'), virtualCardController.deleteVirtualCard)

export default virtualCardRouter