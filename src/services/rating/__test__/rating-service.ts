/* eslint-disable security/detect-object-injection */
import { StormGlassForecastAPIResponseNormalized } from '@src/clients/stormglass-http-client'
import { BeachPosition } from '@src/infra/models/beach-model'
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
    if (period >= 7 && period < 10) return 2
    if (period >= 10 && period < 14) return 4
    if (period >= 14) return 5
    return 1
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
    const ok =
      heigh >= waveHeights.ankleToKnee.min &&
      heigh < waveHeights.ankleToKnee.max
    const good =
      heigh >= waveHeights.waistHigh.min && heigh < waveHeights.waistHigh.max
    const veryGood = heigh >= waveHeights.headHigh.min
    if (ok) return 2
    if (good) return 3
    if (veryGood) return 5
    return 1
  }

  public getPositionFromLocation (direction: number): BeachPosition {
    if (direction > 315 || (direction <= 45 && direction >= 0))
      return BeachPosition.N
    if (direction > 45 && direction <= 135) return BeachPosition.E
    if (direction > 135 && direction <= 225) return BeachPosition.S
    // if (direction > 225 && direction <= 315)
    return BeachPosition.W
  }

  private isWindOffshore (windPosition: string, wavePosition: string): boolean {
    return (
      (wavePosition === BeachPosition.N &&
        windPosition === BeachPosition.S &&
        this.beach.position === BeachPosition.N) ||
      (wavePosition === BeachPosition.S &&
        windPosition === BeachPosition.N &&
        this.beach.position === BeachPosition.S) ||
      (wavePosition === BeachPosition.E &&
        windPosition === BeachPosition.W &&
        this.beach.position === BeachPosition.E) ||
      (wavePosition === BeachPosition.W &&
        windPosition === BeachPosition.W &&
        this.beach.position === BeachPosition.W)
    )
  }
}
