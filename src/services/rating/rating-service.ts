/* eslint-disable security/detect-object-injection */
import { StormGlassForecastAPIResponseNormalized } from '@src/clients/stormglass-http-client'
import { GeoPosition } from '@src/infra/models/beach-model'
import { BeachDTO } from '@src/services/beach/beach-dto'

export class RatingService {
  constructor (private readonly beach: BeachDTO) {}

  public getRateForPoint (
    point: StormGlassForecastAPIResponseNormalized
  ): number {
    const swellDirection = this.getPositionFromLocation(point.swellDirection)
    const windDirection = this.getPositionFromLocation(point.windDirection)
    const windAndWaveDirectionRating = this.getRatingBasedOnWindAndWavePositions(
      swellDirection,
      windDirection
    )
    const swellHeightRating = this.getRatingForSwellHeight(point.swellHeight)
    const swellPeriodRating = this.getRatingForSwellPeriod(point.swellPeriod)
    const finalRating =
      (windAndWaveDirectionRating + swellHeightRating + swellPeriodRating) / 3
    return Math.round(finalRating)
  }

  public getRatingBasedOnWindAndWavePositions (
    wavePosition: string,
    windPosition: string
  ): number {
    if (wavePosition === windPosition) return 1
    if (this.isWindOffshore(windPosition, wavePosition)) return 5
    return 3
  }

  public getRatingForSwellPeriod (period: number): number {
    if (period < 7) return 1
    if (period < 10) return 2
    if (period < 14) return 4
    return 5
  }

  public getRatingForSwellHeight (heigh: number): number {
    const waveHeights = {
      ankleToKnee: {
        min: 0.3,
        max: 1
      },
      waistHigh: {
        min: 1,
        max: 2
      },
      headHigh: {
        min: 2,
        max: 2.5
      }
    }
    if (heigh < waveHeights.ankleToKnee.min) return 1
    if (heigh < waveHeights.ankleToKnee.max) return 2
    if (heigh < waveHeights.headHigh.max) return 3
    return 5
  }

  public getPositionFromLocation (direction: number): GeoPosition {
    if (direction <= 45) return GeoPosition.N
    if (direction <= 135) return GeoPosition.E
    if (direction <= 225) return GeoPosition.S
    if (direction <= 315) return GeoPosition.W
    return GeoPosition.N
  }

  private isWindOffshore (windPosition: string, wavePosition: string): boolean {
    return (
      (wavePosition === GeoPosition.N &&
        windPosition === GeoPosition.S &&
        this.beach.position === GeoPosition.N) ||
      (wavePosition === GeoPosition.S &&
        windPosition === GeoPosition.N &&
        this.beach.position === GeoPosition.S) ||
      (wavePosition === GeoPosition.E &&
        windPosition === GeoPosition.W &&
        this.beach.position === GeoPosition.E) ||
      (wavePosition === GeoPosition.W &&
        windPosition === GeoPosition.W &&
        this.beach.position === GeoPosition.W)
    )
  }
}
