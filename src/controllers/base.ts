import { Logger } from '@src/infra/logger'
import { CUSTOM_VALIDATION } from '@src/infra/models/user-model'
import { ApiError, APIError } from '@src/infra/utils/errors/api-error'
import { Response } from 'express'
import { Error } from 'mongoose'

/**
 * classe base para resposta de erros para os controladores.
 */
export abstract class BaseController {
  protected sendCreateUpdateErrorResponse (
    res: Response,
    err: Error.ValidationError | Error
  ): Response {
    if (err instanceof Error.ValidationError) {
      const { code, error } = this.handleClientErrors(err)
      return res
        .status(code)
        .send(ApiError.format({ code: code, message: error }))
    }

    Logger.error(err)

    return res
      .status(500)
      .send(ApiError.format({ code: 500, message: 'Something went wrong!' }))
  }

  protected sendErrorResponse (res: Response, error: APIError): Response {
    return res.status(error.code).send(ApiError.format(error))
  }

  private handleClientErrors (
    error: Error.ValidationError
  ): { code: number; error: string } {
    const errorsArray = Object.values(error.errors)
    // verifica se alguns dos erros é sobre valor de email duplicado
    const duplicatedKindErrors = errorsArray.filter(
      (error: any) => error.kind === CUSTOM_VALIDATION.DUPLICATED
    )

    if (duplicatedKindErrors.length) {
      return { code: 400, error: error.message }
    }

    return { code: 400, error: error.message }
  }
}
