import { Router } from 'express'
import * as rechargeController from '../controllers/rechargeController.js'
import validateSchemas from '../middlewares/validateSchemas.js'
import verifyCompanyApiKey from '../middlewares/verifyCompanyApiKey.js'

const rechargeRouter = Router()

rechargeRouter.post('/recharges/:cardId/recharge', verifyCompanyApiKey, validateSchemas('amount'), rechargeController.recharge)

export default rechargeRouter