import { Controller, Get, Middleware, Post } from '@overnightjs/core'
import { Request, Response } from 'express'

import { BaseController } from './base'

import { UserMongoRepository } from '@src/repositories/user-repo'
import { AuthUserService } from '@src/services/user/auth-user-service'
import { CreateUserService } from '@src/services/user/create-user-service'
import { authMiddleware } from '@src/infra/middlewares/auth-middle'
import { FindUserByIdService } from '@src/services/user/find-user-by-id-service'
// import { Logger } from '@src/infra/logger'

@Controller('users')
export class UsersController extends BaseController {
  @Post('create')
  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body.newUser
      const userRepo = new UserMongoRepository()
      const createUserService = new CreateUserService(userRepo)
      const response = await createUserService.execute(userData)

      res.status(201).send(response)
    } catch (err) {
      this.sendCreateUpdateErrorResponse(res, err as any)
    }
  }

  @Post('authenticate')
  public async authenticate(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body
      const userRepo = new UserMongoRepository()
      const authUserService = new AuthUserService(userRepo)
      const {
        user,
        passwordComparisonResult,
        token
      } = await authUserService.execute(email, password)

      if (!user) {
        return this.sendErrorResponse(res, {
          code: 401,
          message: 'User not found with the given email address'
        })
      }

      if (!passwordComparisonResult) {
        return this.sendErrorResponse(res, {
          code: 401,
          message: 'Incorrect password'
        })
      }

      res.status(200).send({ token })
    } catch (err) {
      this.sendErrorResponse(res, err as any)
    }
  }

  @Get('me')
  @Middleware(authMiddleware)
  public async me(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.decoded?.id
      const userRepo = new UserMongoRepository()
      const findUserService = new FindUserByIdService(userRepo)
      const user = await findUserService.execute(userId as string)

      if (!user) {
        return this.sendErrorResponse(res, {
          code: 404,
          message: 'User not found'
        })
      }

      res.status(200).send({ user })
    } catch (err) {
      this.sendErrorResponse(res, err as any)
    }
  }
}
