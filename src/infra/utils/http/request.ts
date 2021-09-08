import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

export interface RequestConfig extends AxiosRequestConfig {
  [key: string]: any
}

export interface Response<T = any> extends AxiosResponse<T> {
  [key: string]: any
}

/**
 *  @classdesc Classe para realizar chamadas HTTP usando libs externas.
 *  @constructor `requester` recebe o módulo que fará as chamadas
 *  externas para a API. Default: `axios`.
 */
export class Request {
  constructor (private requester = axios) {
    this.requester = requester
  }

  /**
   *
   * @param url url da API a ser chamada.
   * @param requestConfig objeto de configurações para inclusão de informações adicionais como headers.
   */
  public async get<T> (
    url: string,
    requestConfig: RequestConfig = {}
  ): Promise<Response<T>> {
    const response = await this.requester.get<T, Response<T>>(
      url,
      requestConfig
    )

    return response
  }

  public static isRequestError(error: AxiosError): boolean {
    return !!(error.response && error.response.status)
  }
}
