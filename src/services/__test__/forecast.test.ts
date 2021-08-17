import { StormGlassHttpClient } from '@src/clients/stormglass-http-client'
import stormGlassNormalizedResponseFixture from '@test/fixtures/stormglass-response-normalized.json'

import { ForecastService } from '../forecast-service'
import { Beach, BeachPosition } from '../forecast-service'
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
})
