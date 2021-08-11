import { AxiosStatic } from 'axios'
import config, { IConfig } from 'config'

import { ClientRequestError, StormGlassResponseError } from './errors'

const stormGlassResourceConfig: IConfig = config.get('App.resources.StormGlass')

export interface StormGlassPointSource {
  noaa: number
}

export interface StormGlassForecastPoint {
  readonly time: string
  readonly swellDirection: StormGlassPointSource
  readonly swellHeight: StormGlassPointSource
  readonly swellPeriod: StormGlassPointSource
  readonly waveHeight: StormGlassPointSource
  readonly waveDirection: StormGlassPointSource
  readonly windSpeed: StormGlassPointSource
  readonly windDirection: StormGlassPointSource
}

export interface StormGlassForecastAPIResponse {
  hours: StormGlassForecastPoint[]
}

export interface GetDestURLParams {
  lat: number
  long: number
}

export interface StormGlassForecastAPIResponseNormalized {
  readonly time: string
  readonly swellDirection: number
  readonly swellHeight: number
  readonly swellPeriod: number
  readonly waveHeight: number
  readonly waveDirection: number
  readonly windSpeed: number
  readonly windDirection: number
}

/**
 * @classdesc cliente HTTP para chamadas externas para a API do Storm Glass
 *
 * @property {string} stormGlassAPIParams - contém os atributos
 * do weather da API.
 * [docs](https://docs.stormglass.io/#/sources?id=weather-attributes).
 * @property {string} stormGlassAPISource - "noaa" é um recurso fonte
 * do weather da API.
 * [docs](https://docs.stormglass.io/#/sources?id=available-sources).
 * @property {object} requester - recebe o módulo que fará as chamadas
 * externas para a API.
 */
export class StormGlassHttpClient {
  readonly stormGlassAPIParams =
    'swellHeight,waveHeight,swellDirection,waveDirection,windDirection,windSpeed,swellPeriod'
  readonly stormGlassAPISource = 'noaa'
  protected requester

  constructor (requester: AxiosStatic) {
    this.requester = requester
  }

  public async fetchPoints (
    lat: number,
    long: number
  ): Promise<StormGlassForecastAPIResponseNormalized[]> {
    const destURL = this.getDestURL({
      lat,
      long
    })
    const apiToken = stormGlassResourceConfig.get('apiToken')
    const credentials = {
      headers: {
        Authorization: apiToken
      }
    }

    try {
      const response = await this.requester.get<StormGlassForecastAPIResponse>(
        destURL,
        credentials
      )

      return this.normalizeReponse(response.data)
    } catch (err) {
      if (err.response && err.response.status) {
        throw new StormGlassResponseError(
          `Error: ${JSON.stringify(err.response.data)} Code: ${
            err.response.status
          }`
        )
      }

      throw new ClientRequestError(err.message)
    }
  }

  /**
   * Função para normalizar os dados de acordo com interface a `StormGlassForecastAPIResponseNormalized`.
   * @param points - `StormGlassForecastAPIResponse`
   * @returns `StormGlassForecastAPIResponseNormalized[]`
   */
  private normalizeReponse (
    points: StormGlassForecastAPIResponse
  ): StormGlassForecastAPIResponseNormalized[] {
    const normalized = points.hours
      .filter(this.isValidPoint.bind(this))
      .map(point => ({
        swellDirection: point.swellDirection[this.stormGlassAPISource],
        swellHeight: point.swellHeight[this.stormGlassAPISource],
        swellPeriod: point.swellPeriod[this.stormGlassAPISource],
        waveHeight: point.waveHeight[this.stormGlassAPISource],
        waveDirection: point.waveDirection[this.stormGlassAPISource],
        windDirection: point.windDirection[this.stormGlassAPISource],
        windSpeed: point.windSpeed[this.stormGlassAPISource],
        time: point.time
      }))

    return normalized
  }

  /**
   * Verifica se todos as propriedades a serem normalizadas estão contidas na resposta.
   * @param point - `StormGlassForecastPoint`
   * @returns `Boolean`
   */
  private isValidPoint (point: Partial<StormGlassForecastPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassAPISource] &&
      point.swellHeight?.[this.stormGlassAPISource] &&
      point.swellPeriod?.[this.stormGlassAPISource] &&
      point.waveHeight?.[this.stormGlassAPISource] &&
      point.waveDirection?.[this.stormGlassAPISource] &&
      point.windDirection?.[this.stormGlassAPISource] &&
      point.windSpeed?.[this.stormGlassAPISource]
    )
  }

  /**
   * @function getDestURL - apenas para retornar a URL de destino com os
   * parâmetros informados
   * @returns {string}
   */
  private getDestURL ({ lat, long }: GetDestURLParams): string {
    const apiUrl = stormGlassResourceConfig.get('apiUrl')

    return `${apiUrl}/weather/point?lat=${lat}&lng=${long}&params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}`
  }
}
