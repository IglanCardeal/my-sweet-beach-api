import { StormGlassHttpClient } from '@src/clients/stormglass-http-client'
import stormGlassNormalizedResponseFixture from '@test/fixtures/stormglass-response-normalized.json'

jest.mock('@src/clients/stormglass-http-client')

describe('Forecast Service', () => {
  it('should return the forecast for a list of beaches', async () => {
    StormGlassHttpClient.prototype.fetchPoints = jest
      .fn()
      .mockResolvedValue(stormGlassNormalizedResponseFixture)
  })
})
