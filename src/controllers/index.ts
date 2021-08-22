import { CUSTOM_VALIDATION } from '@src/models/user-model'
import { Response } from 'express'
import { Error } from 'mongoose'

/**
 * classe base para resposta de erros para os controladores.
 * @abstract
 */
export abstract class BaseController {
  protected sendCreatedUpdatedErrorResponse (
    res: Response,
    err: Error.ValidationError | Error
  ): Response {
    if (err instanceof Error.ValidationError) {
      const errorsArray = Object.values(err.errors)
      // verifica se alguns dos erros é sobre valor de email duplicado
      const duplicatedKindErrors = errorsArray.filter(
        (error: any) => error.kind === CUSTOM_VALIDATION.DUPLICATED
      )
      
      if (duplicatedKindErrors.length) {
        return res.status(409).send({ code: 409, error: err.message })
      }

      return res.status(422).send({ code: 422, error: err.message })
    }

    // para erros de email duplicado
    // if (err instanceof mongo.MongoError) {
    //   const error = err as any
    //   console.log(error.keyPattern, error.keyValue)
    //   return res.status(409).send({ code: 409, error: err.message })
    // }

    return res.status(500).send({ code: 500, error: 'Something went wrong!' })
  }
}
