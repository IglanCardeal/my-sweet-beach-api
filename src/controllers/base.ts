import { Logger } from '@src/infra/logger'
import { CUSTOM_VALIDATION } from '@src/models/user-model'
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

      return res.status(code).send({ code: code, error: error })
    }

    Logger.error(err)

    return res.status(500).send({ code: 500, error: 'Something went wrong!' })
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
      return { code: 409, error: error.message }
    }

    return { code: 422, error: error.message }
  }
}
