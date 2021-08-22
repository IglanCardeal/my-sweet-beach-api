import { Controller, Post } from '@overnightjs/core'
import { Request, Response } from 'express'

@Controller('users')
export class UsersController {
  @Post('')
  public async getForecastForLoggedUser (
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { newUser } = req.body

      res.status(201).send(newUser)
    } catch (error) {
      console.error(error)

      if (error instanceof Error)
        res.status(500).send({ error: 'Internal Server Error' })
    }
  }
}
