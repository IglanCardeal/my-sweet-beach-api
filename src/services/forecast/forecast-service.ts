import _ from 'lodash'
import {
  StormGlassHttpClient,
  StormGlassForecastAPIResponseNormalized
} from '@src/clients/stormglass-http-client'
import { BeachDTO } from '../beach/beach-dto'
import { RatingService } from '../rating/rating-service'
import { ForecastProcessingInternalError } from './error'

export interface BeachForecast
  extends Omit<BeachDTO, 'user'>,
    StormGlassForecastAPIResponseNormalized {}

export interface TimeForecast {
  time: string
  forecast: BeachForecast[]
}

export class ProcessForecastForBeachesService {
  constructor (
    protected stormGlass = new StormGlassHttpClient(),
    protected Rating: typeof RatingService = RatingService
  ) {}

  /**
   * retorna os dados normalizados com a previsão do tempo para cada Beach.
   */
  public async execute (beaches: BeachDTO[]): Promise<TimeForecast[]> {
    try {
      const pointsWithCorrectedSources = await this.calculateRatings(beaches)
      const timeForecast = this.mapForecastByTime(pointsWithCorrectedSources)
      return timeForecast.map(forecast => ({
        time: forecast.time,
        forecast: _.orderBy(forecast.forecast, ['rating'], ['desc'])
      }))
    } catch (err) {
      const error = err as any
      throw new ForecastProcessingInternalError(error.message)
    }
  }

  private async calculateRatings (
    beaches: BeachDTO[]
  ): Promise<BeachForecast[]> {
    const pointsWithCorrectedSources: BeachForecast[] = []
    const result = await this.calculateInParallel(beaches)
    if (result && result.length) {
      result.forEach((res: BeachForecast[]) => {
        pointsWithCorrectedSources.push(...res)
      })
    }
    return pointsWithCorrectedSources
  }

  /**
   * Para melhor performance, trabalhando em paralelo o cálculo de cada `Beach`.
   */
  private async calculateInParallel (
    beaches: BeachDTO[]
  ): Promise<BeachForecast[][]> {
    const promises: Promise<BeachForecast[]>[] = []
    for (const beach of beaches) {
      promises.push(this.fetchAndEnrichBeachData(beach))
    }
    const result = await Promise.all(promises)
    return result
  }

  private async fetchAndEnrichBeachData (
    beach: BeachDTO
  ): Promise<BeachForecast[]> {
    const rating = new this.Rating(beach)
    const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng)
    const enrichedBeachData = this.mergeBeachAndPointsData(
      points,
      beach,
      rating
    )
    return enrichedBeachData
  }

  private mapForecastByTime (forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = []
    for (const point of forecast) {
      const timePoint = forecastByTime.find(f => f.time === point.time)
      if (timePoint) {
        timePoint.forecast.push(point)
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point]
        })
      }
    }
    return forecastByTime
  }

  /**
   * normaliza os dados fazendo um merge entre `StormGlassForecastAPIResponseNormalized` e `Beach`.
   */
  private mergeBeachAndPointsData (
    points: StormGlassForecastAPIResponseNormalized[],
    beach: BeachDTO,
    rating: RatingService
  ): BeachForecast[] {
    return points.map(point => ({
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: rating.getRateForPoint(point)
      },
      ...point
    }))
  }
}
