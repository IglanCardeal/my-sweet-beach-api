import { AuthService } from '@src/services/auth-service'
import { NextFunction, Request, Response } from 'express'

export const authMiddleware = (
  req: Partial<Request>,
  _: Partial<Response>,
  next: NextFunction
): void => {
  const token = req.headers?.['x-access-token']
  const decodedUser = AuthService.decodeToken(token as string)

  req.decoded = decodedUser

  next()
}
