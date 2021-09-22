/* eslint-disable security/detect-object-injection */
import { BeachPosition } from '@src/infra/models/beach-model'
import { BeachDTO } from '@src/services/beach/beach-dto'

export class RatingService {
  constructor (private readonly beach: BeachDTO) {}

  public getRatingBasedOnWindAndWavePositions (
    wavePosition: string,
    windPosition: string
  ): number {
    if (wavePosition === windPosition) {
      return 1
    }
    if (this.isWindOffshore(windPosition, wavePosition)) {
      return 5
    }
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
    if (
      heigh >= waveHeights.ankleToKnee.min &&
      heigh < waveHeights.ankleToKnee.max
    ) {
      return 2
    }
    if (
      heigh >= waveHeights.waistHigh.min &&
      heigh < waveHeights.waistHigh.max
    ) {
      return 3
    }
    if (heigh >= waveHeights.headHigh.min) {
      return 5
    }
    return 1
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
