import { Router } from 'express'
import * as paymentController from '../controllers/paymentController.js'
import validateSchemas from '../middlewares/validateSchemas.js'

const paymentRouter = Router()

paymentRouter.post('/payments/:cardId/:businessId/pay', validateSchemas('amount'), paymentController.paymentPos)

export default paymentRouter