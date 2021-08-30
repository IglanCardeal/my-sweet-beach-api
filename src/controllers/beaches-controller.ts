import { ClassMiddleware, Controller, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { Error } from 'mongoose'

import { BeachModel } from '@src/models/beach-model'
import { authMiddleware } from '@src/middlewares/auth-middle'

@Controller('beaches')
@ClassMiddleware(authMiddleware)
export class BeachesController {
  @Post('')
  public async create (req: Request, res: Response): Promise<void> {
    const { newBeach } = req.body

    try {
      const beach = new BeachModel({ ...newBeach, user: req.decoded?.id })
      const result = await beach.save()

      res.status(201).send(result)
    } catch (err) {
      if (err instanceof Error.ValidationError)
        res.status(422).send({ error: err.message })
      else res.status(500).send({ error: 'Internal Server Error' })
    }
  }
}
