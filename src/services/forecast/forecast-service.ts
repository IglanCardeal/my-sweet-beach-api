/* eslint-disable no-unused-vars */
import {
  StormGlassHttpClient,
  StormGlassForecastAPIResponseNormalized
} from '@src/clients/stormglass-http-client'
import { BeachDTO } from '../beach/beach-dto'
import { ForecastProcessingInternalError } from './error'

export interface BeachForecast
  extends Omit<BeachDTO, 'user'>,
    StormGlassForecastAPIResponseNormalized {}

export interface TimeForecast {
  time: string
  forecast: BeachForecast[]
}

export class ProcessForecastForBeachesService {
  constructor (protected stormGlass = new StormGlassHttpClient()) {}

  /**
   * retorna os dados normalizados com a previsão do tempo para cada Beach.
   */
  public async execute (
    beaches: BeachDTO[]
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

      throw new ForecastProcessingInternalError(error.message)
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
    beach: BeachDTO
  ): BeachForecast[] {
    return points.map(point => ({
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: 1
      },
      ...point
    }))
  }
}
