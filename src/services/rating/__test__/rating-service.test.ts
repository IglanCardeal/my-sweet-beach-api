import { BeachPosition } from '@src/infra/models/beach-model'
import { RatingService } from './rating-service'

describe('Rating Service', () => {
  const beach = {
    lat: -33.792726,
    lng: 151.289824,
    name: 'Manly',
    position: 'E',
    user: 'any user'
  }
  const defaultConfig = new RatingService(beach)

  describe('Calculete rating for a given point', () => {
    it.skip('', () => {
      expect(1).toBeTruthy()
    })
  })

  describe('Get rating bases on wind and wave positions', () => {
    it('should get rating 1 for a beach with onshore winds', () => {
      const rating = defaultConfig.getRatingBasedOnWindAndWavePositions(
        BeachPosition.E,
        BeachPosition.E
      )
      expect(rating).toBe(1)
    })

    it('should get rating 3 for a beach with cross winds', () => {
      const rating = defaultConfig.getRatingBasedOnWindAndWavePositions(
        BeachPosition.E,
        BeachPosition.S
      )
      expect(rating).toBe(3)
    })

    it('should get rating 5 for a beach with offshore winds', () => {
      const rating = defaultConfig.getRatingBasedOnWindAndWavePositions(
        BeachPosition.E,
        BeachPosition.W
      )
      expect(rating).toBe(5)
    })
  })

  describe('Get rating base on swell period', () => {
    it('should get a rating 1 for a period of 5 seconds', () => {
      const rating = defaultConfig.getRatingForSwellPeriod(5)
      expect(rating).toBe(1)
    })
  })
})
