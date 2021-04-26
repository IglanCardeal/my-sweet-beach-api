import { AxiosStatic } from 'axios'

import { config } from 'dotenv'

config()

const { STORMGLASS_API_KEY } = process.env

// Esta classe que fica reponsavel pela chamadas 
// para a API do Storm Glass
export class StormGlass {
  readonly stormGlassAPIParams =
    'swellHeight,waveHeight,swellDirection,waveDirection,windDirection,windSpeed,swellPeriod'
  readonly stormGlassAPISource = 'noaa'
  protected requester

  constructor(requester: AxiosStatic) {
    this.requester = requester
  }

  public async fetchPoints(lat: number, long: number): Promise<any> {
    return await this.requester.get(
      `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${long}&params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}`,
      {
        headers: {
          Authorization: 'example-api-key'
        }
      }
    )
  }
}
