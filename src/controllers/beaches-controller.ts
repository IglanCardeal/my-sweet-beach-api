import { ClassMiddleware, Controller, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { Error } from 'mongoose'

import { authMiddleware } from '@src/middlewares/auth-middle'
import { BeachDTO, BeachService } from '@src/services/beache-service'

@Controller('beaches')
@ClassMiddleware(authMiddleware)
export class BeachesController {
  @Post('')
  public async create (req: Request, res: Response): Promise<void> {
    const { newBeach } = req.body
    const beachData: BeachDTO = { ...newBeach, user: req.decoded?.id }

    try {
      const beachService = new BeachService()

      await beachService.createBeach(beachData)

      res.status(201).send(beachData)
    } catch (err) {
      if (err instanceof Error.ValidationError)
        res.status(422).send({ error: err.message })
      else res.status(500).send({ error: 'Internal Server Error' })
    }
  }
}
