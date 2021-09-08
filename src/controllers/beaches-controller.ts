import { ClassMiddleware, Controller, Post } from '@overnightjs/core'
import { Request, Response } from 'express'

import { CreateBeachService } from '@src/services/beach/create-beach-service'
import { BeachDTO } from '@src/services/beach/beach-dto'

import { BeachMongoRepository } from '@src/repositories/beach-repo'

import { authMiddleware } from '@src/infra/middlewares/auth-middle'
import { BaseController } from './base'

@Controller('beaches')
@ClassMiddleware(authMiddleware)
export class BeachesController extends BaseController{
  @Post('')
  public async create (req: Request, res: Response): Promise<void> {
    const { newBeach } = req.body
    const beachData: BeachDTO = { ...newBeach, user: req.decoded?.id }

    try {
      const beachRepo = new BeachMongoRepository()
      const beachService = new CreateBeachService(beachRepo)

      await beachService.execute(beachData)

      res.status(201).send(beachData)
    } catch (err) {
      this.sendCreateUpdateErrorResponse(res, err as any)
      // if (err instanceof Error.ValidationError)
      //   res.status(422).send({ error: err.message })
      // else res.status(500).send({ error: 'Internal Server Error' })
    }
  }
}
