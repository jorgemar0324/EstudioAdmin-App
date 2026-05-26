import { Router } from 'express'
import { taskService } from '../services'
import { sendResult } from '../lib/sendResult'

const router = Router()

router.patch('/:id', async (req, res) => sendResult(res, await taskService.update(req.params.id, req.body)))
router.delete('/:id', async (req, res) => sendResult(res, await taskService.delete(req.params.id), 204))

export default router
