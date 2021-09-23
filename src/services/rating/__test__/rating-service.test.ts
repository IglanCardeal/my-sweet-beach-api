import { GeoPosition } from '@src/infra/models/beach-model'
import { RatingService } from '../rating-service'

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
    const defaultPoint = {
      swellDirection: 110,
      swellHeight: 0.6,
      swellPeriod: 5,
      time: 'test',
      waveDirection: 110,
      waveHeight: 0.1,
      windDirection: 100,
      windSpeed: 100
    }
    it('should get a rating 1 for a poor point', () => {
      const rating = defaultConfig.getRateForPoint(defaultPoint)
      expect(rating).toBe(1)
    })

    it('should get a rating 1 for a ok point', () => {
      const rating = defaultConfig.getRateForPoint({
        ...defaultPoint,
        swellHeight: 0.4
      })
      expect(rating).toBe(1)
    })

    it('should get a rating 3 for point with offshore winds and half overhead height', () => {
      const rating = defaultConfig.getRateForPoint({
        ...defaultPoint,
        ...{ swellHeight: 0.7, windDirection: 250 }
      })
      expect(rating).toBe(3)
    })

    it('should get a rating of 4 for a point with offshore winds, half overhead high swell and good interval', () => {
      const point = {
        ...defaultPoint,
        ...{
          swellHeight: 0.7,
          swellPeriod: 12,
          windDirection: 250
        }
      }
      const rating = defaultConfig.getRateForPoint(point)
      expect(rating).toBe(4)
    })

    it('should get a rating of 4 for a point with offshore winds, shoulder high swell and good interval', () => {
      const point = {
        ...defaultPoint,
        ...{
          swellHeight: 1.5,
          swellPeriod: 12,
          windDirection: 250
        }
      }
      const rating = defaultConfig.getRateForPoint(point)
      expect(rating).toBe(4)
    })

    it('should get a rating of 5 classic day!', () => {
      const point = {
        ...defaultPoint,
        ...{
          swellHeight: 2.5,
          swellPeriod: 16,
          windDirection: 250
        }
      }
      const rating = defaultConfig.getRateForPoint(point)
      expect(rating).toBe(5)
    })
    it('should get a rating of 4 a good condition but with crossshore winds', () => {
      const point = {
        ...defaultPoint,
        ...{
          swellHeight: 2.5,
          swellPeriod: 16,
          windDirection: 130
        }
      }
      const rating = defaultConfig.getRateForPoint(point)
      expect(rating).toBe(4)
    })
  })

  describe('Get rating bases on wind and wave positions', () => {
    it('should get rating 1 for a beach with onshore winds', () => {
      const rating = defaultConfig.getRatingBasedOnWindAndWavePositions(
        GeoPosition.E,
        GeoPosition.E
      )
      expect(rating).toBe(1)
    })

    it('should get rating 3 for a beach with cross winds', () => {
      const rating = defaultConfig.getRatingBasedOnWindAndWavePositions(
        GeoPosition.E,
        GeoPosition.S
      )
      expect(rating).toBe(3)
    })

    it('should get rating 5 for a beach with offshore winds', () => {
      const rating = defaultConfig.getRatingBasedOnWindAndWavePositions(
        GeoPosition.E,
        GeoPosition.W
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
      expect(position).toBe(GeoPosition.E)
    })

    it('should get the point based on north position', () => {
      const position = defaultConfig.getPositionFromLocation(1)
      expect(position).toBe(GeoPosition.N)
    })

    it('should get the point based on west position', () => {
      const position = defaultConfig.getPositionFromLocation(268)
      expect(position).toBe(GeoPosition.W)
    })

    it('should get the point based on south position', () => {
      const position = defaultConfig.getPositionFromLocation(185)
      expect(position).toBe(GeoPosition.S)
    })
  })
})
