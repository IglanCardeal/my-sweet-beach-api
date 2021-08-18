import { Controller, Post } from '@overnightjs/core'
import { Request, Response } from 'express'

@Controller('beaches')
export class BeachesController {
  @Post('')
  public getForecastForLoggedUser (req: Request, res: Response): void {
    res.status(201).json(req.body.newBeach)
  }
}
