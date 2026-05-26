import { Router } from 'express'
import { sessionService } from '../services'
import { sendResult } from '../lib/sendResult'

const router = Router()

router.get('/active',   async (_req, res) => sendResult(res, await sessionService.getActive()))
router.patch('/:id',    async (req,  res) => sendResult(res, await sessionService.close(req.params.id)))

export default router
