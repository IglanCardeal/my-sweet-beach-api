import { Controller, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { Error, mongo } from 'mongoose'

import { UserModel } from '@src/models/user-model'

@Controller('users')
export class UsersController {
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
      if (error instanceof Error.ValidationError)
        res.status(400).send({ error: error.message })

      if (error instanceof mongo.MongoError)
        res.status(401).send({ error: error.message })

      if (error instanceof Error)
        res.status(500).send({ error: 'Internal Server Error' })
    }
  }
}
