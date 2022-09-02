import { Router } from 'express'
import cardRouter from './cardRouter.js'
import paymentRouter from './paymentRouter.js'
import rechargeRouter from './rechargeRouter.js'
import virtualCardRouter from './virtualCardRouter.js'

const router = Router()

router.use(cardRouter)
router.use(rechargeRouter)
router.use(paymentRouter)
router.use(virtualCardRouter)

export default router