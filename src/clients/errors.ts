/**
 * Essas classes de erros são para tratamento de erros da classe `StormGlassHttpClient`.
 */
import { InternalError } from '@src/infra/utils/errors/internal-error'

/**
 * trata erros de chamada do cliente da API do Storm Glass
 */
export class ClientRequestError extends InternalError {
  constructor (message: string) {
    const internalMessage =
      'Unexpected error when trying to communicate to StormGlass'

    super(`${internalMessage}: ${message}`)
  }
}

/**
 * trata erros de resposta da API do Storm Glass
 */
export class StormGlassResponseError extends InternalError {
  constructor (message: string) {
    const internalMessage =
      'Unexpected error returned by the StormGlass service'

    super(`${internalMessage}: ${message}`)
  }
}
