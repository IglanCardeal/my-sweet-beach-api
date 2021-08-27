import { Controller, Post } from '@overnightjs/core'
import { Request, Response } from 'express'

import { UserModel } from '@src/models/user-model'
import { BaseController } from '.'
import { AuthService } from '@src/services/auth-service'

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
  public async authenticate (req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body

      const user = await UserModel.findOne({ email })

      if (!user)
        return res.status(401).send({
          code: 401,
          error: 'User not found with the given email address'
        })

      const passwordComparisonResult = await AuthService.comparePassword(
        password,
        user.password
      )

      if (!passwordComparisonResult) {
        return res.status(401).send({
          code: 401,
          error: 'Incorrect password'
        })
      }

      const token = AuthService.generateToken(user.toJSON())

      res.status(200).send({ token })
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error as any)
    }
  }
}
