import { InternalError } from '@src/infra/utils/errors/internal-error'

export class ForecastProcessingInternalError extends InternalError {
  constructor (message: string) {
    super(`Unexpected error during the forecast processing: ${message}`)
  }
}