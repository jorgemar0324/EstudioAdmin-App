import type { Response } from 'express'
import type { ServiceResult } from './serviceResult'

export function sendResult<T>(res: Response, result: ServiceResult<T>, successStatus = 200): void {
  if (result.ok) {
    if (successStatus === 204) {
      res.status(204).send()
    } else {
      res.status(successStatus).json(result.data)
    }
  } else {
    res.status(result.status).json({ error: result.message })
  }
}
