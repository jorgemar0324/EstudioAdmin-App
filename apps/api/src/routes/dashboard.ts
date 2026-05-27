import { Router } from 'express'
import { dashboardService } from '../services'
import { sendResult } from '../lib/sendResult'

const router = Router()

router.get('/', async (_req, res) => sendResult(res, await dashboardService.get()))

export default router
