import { Response } from 'express'
import { Error } from 'mongoose'

/**
 * classe base para resposta de erros para os controladores.
 * @abstract
 */
export abstract class BaseController {
  protected sendCreatedUpdatedErrorResponse (
    res: Response,
    err: Error.ValidationError
  ): Response {
    if (err instanceof Error.ValidationError)
      return res.status(422).send({ code: 422, error: err.message })

    return res.status(500).send({ code: 500, error: 'Something went wrong!' })
  }
}
