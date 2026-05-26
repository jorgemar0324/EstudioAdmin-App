import { Router } from 'express'
import { taskService } from '../services'
import { sendResult } from '../lib/sendResult'

const router = Router()

router.patch('/:id', async (req, res) => sendResult(res, await taskService.update(req.params.id, req.body)))

export default router
