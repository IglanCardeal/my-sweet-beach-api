/* eslint-disable no-unused-vars */
import {
  StormGlassHttpClient,
  StormGlassForecastAPIResponseNormalized
} from '@src/clients/stormglass-http-client'

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N'
}

export interface Beach {
  lat: number
  lng: number
  name: string
  user: string
  position: BeachPosition
}

export interface BeachForecast
  extends Omit<Beach, 'user'>,
    StormGlassForecastAPIResponseNormalized {}

/**
 * @param  {} stormGlass - classe cliente para chamadas HTTP do Storm Glass.
 * Default: {@link StormGlassHttpClient}
 */
export class ForecastService {
  constructor (protected stormGlass = new StormGlassHttpClient()) {}

  /**
   *
   * @param beaches - array de Beaches onde cada uma terá uma chamada para o `fetchPoints` e será feito um merge com a resposta do client HTTP com os dados de cada Beach.
   * @returns retorna os dados normalizados com a previsão do tempo para cada Beach.
   */
  public async processForecastForBeaches (
    beaches: Beach[]
  ): Promise<BeachForecast[]> {
    const pointsWithCorrectedSources: BeachForecast[] = []

    for (const beach of beaches) {
      const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng)
      // normaliza os dados fazendo um merge
      const enrichedBeachData = points.map(e => ({
        ...{
          lat: beach.lat,
          lng: beach.lng,
          name: beach.name,
          position: beach.position,
          rating: 1
        },
        ...e
      }))

      pointsWithCorrectedSources.push(...enrichedBeachData)
    }

    return pointsWithCorrectedSources
  }
}
