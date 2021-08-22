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
      this.sendCreatedUpdatedErrorResponse(res, error as any)
      // if (error instanceof Error.ValidationError) {
      //   // erros de campos inválidos
      //   res.status(400).send({ error: error.message, code: 400 })
      // } else if (error instanceof mongo.MongoError) {
      //   // para erros de email duplicado
      //   res.status(401).send({ error: error.message })
      // } else {
      //   res.status(500).send({ error: 'Internal Server Error' })
      // }
    }
  }
}
