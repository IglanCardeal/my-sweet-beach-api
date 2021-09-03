import { ClassMiddleware, Controller, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { Error } from 'mongoose'

import { CreateBeachService } from '@src/services/beach/create-beach-service'
import { BeachDTO } from '@src/services/beach/beach-dto'

import { MongoBeachRepository } from '@src/repositories/beach-repo'

import { authMiddleware } from '@src/middlewares/auth-middle'

@Controller('beaches')
@ClassMiddleware(authMiddleware)
export class BeachesController {
  @Post('')
  public async create (req: Request, res: Response): Promise<void> {
    const { newBeach } = req.body
    const beachData: BeachDTO = { ...newBeach, user: req.decoded?.id }

    try {
      const beachRepo = new MongoBeachRepository()
      const beachService = new CreateBeachService(beachRepo)

      await beachService.execute(beachData)

      res.status(201).send(beachData)
    } catch (err) {
      if (err instanceof Error.ValidationError)
        res.status(422).send({ error: err.message })
      else res.status(500).send({ error: 'Internal Server Error' })
    }
  }
}
