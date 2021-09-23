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

    it('should get a rating 2 for a period of 9 seconds', () => {
      const rating = defaultConfig.getRatingForSwellPeriod(9)
      expect(rating).toBe(2)
    })

    it('should get a rating 4 for a period of 12 seconds', () => {
      const rating = defaultConfig.getRatingForSwellPeriod(12)
      expect(rating).toBe(4)
    })

    it('should get a rating 5 for a period of 15 seconds', () => {
      const rating = defaultConfig.getRatingForSwellPeriod(15)
      expect(rating).toBe(5)
    })
  })

  describe('Get rating base on swell height', () => {
    it('should get rating 1 for a less than ankle to knee high swell', () => {
      const rating = defaultConfig.getRatingForSwellHeight(0.2)
      expect(rating).toBe(1)
    })

    it('should get rating 2 for an ankle to knee high swell', () => {
      const rating = defaultConfig.getRatingForSwellHeight(0.6)
      expect(rating).toBe(2)
    })

    it('should get rating 3 for waist high swell', () => {
      const rating = defaultConfig.getRatingForSwellHeight(1.5)
      expect(rating).toBe(3)
    })

    it('should get rating 5 for overhead high swell', () => {
      const rating = defaultConfig.getRatingForSwellHeight(2.5)
      expect(rating).toBe(5)
    })
  })

  describe('Get position based on points location', () => {
    it('should get the point based on east position', () => {
      const position = defaultConfig.getPositionFromLocation(92)
      expect(position).toBe(BeachPosition.E)
    })

    it('should get the point based on north position', () => {
      const position = defaultConfig.getPositionFromLocation(1)
      expect(position).toBe(BeachPosition.N)
    })

    it('should get the point based on west position', () => {
      const position = defaultConfig.getPositionFromLocation(268)
      expect(position).toBe(BeachPosition.W)
    })

    it('should get the point based on south position', () => {
      const position = defaultConfig.getPositionFromLocation(185)
      expect(position).toBe(BeachPosition.S)
    })
  })
})
