import { Controller, Post } from '@overnightjs/core'
import { Request, Response } from 'express'

import { BaseController } from './base'

import { UserMongoRepository } from '@src/repositories/user-repo'
import { AuthUserService } from '@src/services/user/auth-user-service'
import { AuthService } from '@src/services/auth/auth-service'
import { CreateUserService } from '@src/services/user/create-user-service'

@Controller('users')
export class UsersController extends BaseController {
  @Post('authenticate')
  public async authenticate(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body
      const userRepo = new UserMongoRepository()
      const authUserService = new AuthUserService(userRepo)
      const user = await authUserService.execute(email)

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

      const token = AuthService.generateToken(user)

      res.status(200).send({ token })
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error as any)
    }
  }

  @Post('')
  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body.newUser
      const userRepo = new UserMongoRepository()
      const createUserService = new CreateUserService(userRepo)
      const response = await createUserService.execute(userData)

      res.status(201).send(response)
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error as any)
    }
  }
}
