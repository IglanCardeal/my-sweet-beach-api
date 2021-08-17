/* eslint-disable no-unused-vars */
import {
  StormGlassHttpClient,
  StormGlassForecastAPIResponseNormalized
} from '@src/clients/stormglass-http-client'
import { InternalError } from '@src/utils/errors/internal-error'

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

export interface TimeForecast {
  time: string
  forecast: BeachForecast[]
}

export class ForecastProcessingInternalError extends InternalError {
  constructor (message: string) {
    super(`Unexpected error during the forecast processing: ${message}`)
  }
}

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
  ): Promise<TimeForecast[]> {
    const pointsWithCorrectedSources: BeachForecast[] = []

    try {
      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng)
        const enrichedBeachData = this.mergeBeachAndPointsData(points, beach)

        pointsWithCorrectedSources.push(...enrichedBeachData)
      }

      return this.mapForecastByTime(pointsWithCorrectedSources)
    } catch (err) {
      const error = err as any

      throw new ForecastProcessingInternalError(error.msg)
    }
  }

  private mapForecastByTime (forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = []

    for (const point of forecast) {
      const timePoint = forecastByTime.find(f => f.time === point.time)

      if (timePoint) timePoint.forecast.push(point)
      else
        forecastByTime.push({
          time: point.time,
          forecast: [point]
        })
    }

    return forecastByTime
  }

  /**
   * normaliza os dados fazendo um merge entre `StormGlassForecastAPIResponseNormalized` e `Beach`.
   */
  private mergeBeachAndPointsData (
    points: StormGlassForecastAPIResponseNormalized[],
    beach: Beach
  ): BeachForecast[] {
    return points.map(e => ({
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: 1
      },
      ...e
    }))
  }
}
