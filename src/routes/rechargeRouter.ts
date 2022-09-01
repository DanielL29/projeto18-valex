import { Router } from 'express'
import * as rechargeController from '../controllers/rechargeController.js'
import validateSchemas from '../middlewares/validateSchemas.js'

const rechargeRouter = Router()

rechargeRouter.post('/recharges/:cardId', validateSchemas('amount'), rechargeController.recharge)

export default rechargeRouter