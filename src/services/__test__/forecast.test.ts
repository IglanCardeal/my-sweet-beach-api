import { StormGlassHttpClient } from '@src/clients/stormglass-http-client'
import stormGlassNormalizedResponseFixture from '@test/fixtures/stormglass-response-normalized.json'
import { expectedResponse } from './expectedResponse'

jest.mock('@src/clients/stormglass-http-client')

describe('Forecast Service', () => {
  it('should return the forecast for a list of beaches', async () => {
    StormGlassHttpClient.prototype.fetchPoints = jest
      .fn()
      .mockResolvedValue(stormGlassNormalizedResponseFixture)

    const beaches = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
        user: 'some-id'
      }
    ]
    const forecast = new ForecastService(new StormGlassHttpClient())
    const beachesWithRating = await forecast.processForecastForBeaches(beaches)

    expect(beachesWithRating).toEqual(expectedResponse)
  })
})
