import { AuthService } from '@src/services/auth/auth-service'
import { NextFunction, Request, Response } from 'express'

export const authMiddleware = (
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction
): void => {
  try {
    const token = req.headers?.['x-access-token']
    const decodedUserData = AuthService.decodeToken(token as string)

    req.decoded = decodedUserData

    next()
  } catch (error) {
    if (error instanceof Error)
      res?.status?.(401).send({ code: 401, error: error.message })
  }
}
