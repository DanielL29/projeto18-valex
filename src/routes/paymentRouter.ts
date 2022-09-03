import { Router } from 'express'
import * as paymentController from '../controllers/paymentController.js'
import validateSchemas from '../middlewares/validateSchemas.js'

const paymentRouter = Router()

paymentRouter.post('/payments/:cardId/:businessId/pos', validateSchemas('amount'), paymentController.paymentPos)
paymentRouter.post('/payments/:cardId/:businessId/online', validateSchemas('online'), paymentController.paymentOnline)

export default paymentRouter