import { Router } from 'express'
import { projectService, taskService, sessionService } from '../services'
import { sendResult } from '../lib/sendResult'

const router = Router()

router.get('/',                 async (_req, res) => sendResult(res, await projectService.list()))
router.get('/:id',              async (req,  res) => sendResult(res, await projectService.getById(req.params.id)))
router.post('/',                async (req,  res) => sendResult(res, await projectService.create(req.body), 201))
router.patch('/:id',            async (req,  res) => sendResult(res, await projectService.update(req.params.id, req.body)))
router.delete('/:id',           async (req,  res) => sendResult(res, await projectService.delete(req.params.id), 204))
router.get('/:id/tasks',        async (req,  res) => sendResult(res, await taskService.listByProject(req.params.id)))
router.post('/:id/tasks',       async (req,  res) => sendResult(res, await taskService.create(req.params.id, req.body), 201))
router.get('/:id/sessions',     async (req,  res) => sendResult(res, await sessionService.listByProject(req.params.id)))
router.post('/:id/sessions',    async (req,  res) => sendResult(res, await sessionService.create(req.params.id), 201))

export default router
