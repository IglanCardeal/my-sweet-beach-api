import { StormGlassHttpClient } from '@src/clients/stormglass-http-client'
import { Beach, BeachPosition } from '@src/infra/models/beach-model'
import stormGlassNormalizedResponseFixture from '@test/fixtures/stormglass-response-normalized.json'

import { ProcessForecastForBeachesService } from '../forecast-service'
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
    const forecast = new ProcessForecastForBeachesService(mockedStormGlassHttpClient)
    const beachesWithRating = await forecast.execute(beaches)

    expect(beachesWithRating).toEqual(expectedResponse)
  })

  it('should return an empty when beaches array is empty', async () => {
    const forecast = new ProcessForecastForBeachesService()
    const response = await forecast.execute([])

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

    const forecast = new ProcessForecastForBeachesService(mockedStormGlassHttpClient)

    await expect(forecast.execute(beaches)).rejects.toThrow(
      Error
    )
  })
})
