// Esta classe é um cliente HTTP para executar chamadas
// à API do Storm Glass
import { AxiosStatic } from 'axios'

import { config } from 'dotenv'

config()

const { STORMGLASS_API_KEY } = process.env

console.log(STORMGLASS_API_KEY)

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
export class StormGlass {
  readonly stormGlassAPIParams =
    'swellHeight,waveHeight,swellDirection,waveDirection,windDirection,windSpeed,swellPeriod'
  readonly stormGlassAPISource = 'noaa'
  protected requester

  constructor (requester: AxiosStatic) {
    this.requester = requester
  }

  public async fetchPoints (lat: number, long: number): Promise<any> {
    const destURL = this.getDestURL({
      lat,
      long
    })

    return await this.requester.get(destURL, {
      headers: {
        Authorization: 'example-api-key'
      }
    })
  }

  /**
   * @function getDestURL - apenas para retornar a URL de destino com os
   * parâmetros informados
   * @returns {string}
   */
  private getDestURL ({ lat, long }: GetDestURLParams): string {
    return `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${long}&params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}`
  }
}

interface GetDestURLParams {
  lat: number
  long: number
}
