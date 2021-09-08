import { AuthService } from '@src/services/auth/auth-service'
import { NextFunction, Request, Response } from 'express'
import { MissingTokenError } from './errors/auth-middle-errors'

export const authMiddleware = (
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction
): void => {
  try {
    const token = req.headers?.['x-access-token']

    if (!token) {
      throw new MissingTokenError('Token was not provided')
    }

    const decodedUserData = AuthService.decodeToken(token as string)

    req.decoded = decodedUserData

    next()
  } catch (err) {
    const error = err as any
    let code = 500

    if (error instanceof Error) code = 401
    if (error instanceof MissingTokenError) code = 400

    res?.status?.(code).send({ code: code, error: error.message })
  }
}
