import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

interface RequestConfig extends AxiosRequestConfig {
  [key: string]: any
}

interface Response<T = any> extends AxiosResponse<T> {
  [key: string]: any
}

/**
 *  @classdesc Classe para realizar chamadas HTTP usando libs externas.
 *  @constructor {Object} `requester` recebe o módulo que fará as chamadas
 *  externas para a API. Default: `axios`.
 */
export class Request {
  constructor (private requester = axios) {
    this.requester = requester
  }

  public async get<T> (
    url: string,
    requestConfig: RequestConfig = {}
  ): Promise<Response<T>> {
    console.log(url, requestConfig)

    const response = await this.requester.get<T, Response<T>>(
      url,
      requestConfig
    )

    return response
  }
}
