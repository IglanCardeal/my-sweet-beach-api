import { StormGlassHttpClient } from '@src/clients/stormglass-http-client'
import { Beach, BeachPosition } from '@src/models/beach-model'
import stormGlassNormalizedResponseFixture from '@test/fixtures/stormglass-response-normalized.json'

import { ForecastService } from '../../forecast-service'
import { expectedResponse } from './expectedResponse'

jest.mock('@src/clients/stormglass-http-client')

describe('Forecast Service', () => {
  const mockedStormGlassHttpClient = new StormGlassHttpClient() as jest.Mocked<
    StormGlassHttpClient
  >

  it('should return the forecast for a list of beaches', async () => {
    mockedStormGlassHttpClient.fetchPoints.mockResolvedValue(
      stormGlassNormalizedResponseFixture
    )

    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: BeachPosition.E,
        user: 'some-id'
      }
    ]
    const forecast = new ForecastService(mockedStormGlassHttpClient)
    const beachesWithRating = await forecast.processForecastForBeaches(beaches)

    expect(beachesWithRating).toEqual(expectedResponse)
  })

  it('should return an empty when beaches array is empty', async () => {
    const forecast = new ForecastService()
    const response = await forecast.processForecastForBeaches([])

    expect(response).toEqual([])
  })

  it('should throw internal processing error when something goes wrong during the rating process', async () => {
    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: BeachPosition.E,
        user: 'some-id'
      }
    ]

    mockedStormGlassHttpClient.fetchPoints.mockRejectedValue(
      'Error fetching data'
    )

    const forecast = new ForecastService(mockedStormGlassHttpClient)

    await expect(forecast.processForecastForBeaches(beaches)).rejects.toThrow(
      Error
    )
  })
})
