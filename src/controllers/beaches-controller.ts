import { ClassMiddleware, Controller, Post } from '@overnightjs/core'
import { Request, Response } from 'express'

import { CreateBeachService } from '@src/services/beach/create-beach-service'
import { BeachDTO } from '@src/services/beach/beach-dto'

import { BeachMongoRepository } from '@src/repositories/beach-repo'

import { authMiddleware } from '@src/infra/middlewares/auth-middle'
import { BaseController } from './base'

@Controller('beaches')
@ClassMiddleware(authMiddleware)
export class BeachesController extends BaseController {
  @Post('')
  public async create (req: Request, res: Response): Promise<void> {
    const { lat, lng, name, position } = req.body
    const beachData: BeachDTO = {
      lat,
      lng,
      name,
      position,
      user: req.decoded?.id ? req.decoded?.id : ''
    }
    try {
      const beachRepo = new BeachMongoRepository()
      const beachService = new CreateBeachService(beachRepo)
      await beachService.execute(beachData)
      res.status(201).send(beachData)
    } catch (err) {
      this.sendCreateUpdateErrorResponse(res, err as any)
    }
  }
}
