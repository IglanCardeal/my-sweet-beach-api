import { Controller, Post } from '@overnightjs/core'
import { Request, Response } from 'express'

import { BeachModel } from '@src/models/beach-model'

@Controller('beaches')
export class BeachesController {
  @Post('')
  public async create (req: Request, res: Response): Promise<void> {
    const { newBeach } = req.body
    const beach = new BeachModel(newBeach)
    const result = await beach.save()

    res.status(201).send(result)
  }
}
