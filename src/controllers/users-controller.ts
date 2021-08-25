import { Controller, Post } from '@overnightjs/core'
import { Request, Response } from 'express'

import { UserModel } from '@src/models/user-model'
import { BaseController } from '.'

@Controller('users')
export class UsersController extends BaseController {
  @Post('')
  public async getForecastForLoggedUser (
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const user = new UserModel(req.body.newUser)
      const response = await user.save()

      res.status(201).send(response)
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error as any)
    }
  }

  @Post('authenticate')
  public async authenticate (req: Request, res: Response): Promise<void> {
    res.status(200).send({ token: 'fake-token' })
  }
}
