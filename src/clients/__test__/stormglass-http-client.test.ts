import * as HTTPUtil from '@src/utils/http/request'

import { StormGlassHttpClient } from '@src/clients/stormglass-http-client'

import stormGlassApiResponseExample from '@test/fixtures/stormglass-response.json'
import stormGlassApiResponseNormalizedExample from '@test/fixtures/stormglass-response-normalized.json'

jest.mock('@src/utils/http/request')

describe('StormGlass Client', () => {
  const MockedRequestClass = HTTPUtil.Request as jest.Mocked<
    typeof HTTPUtil.Request
  >
  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>

  it('should load StormGlass class from stormGlass.ts file', () => {
    expect(StormGlassHttpClient).toBeDefined()
  })

  it('should return StormGlass objects with some metadata', async () => {
    const lat = -1.4333344573775566
    const long = -48.48368604061809

    // faz o mock da resposta da API
    mockedRequest.get.mockResolvedValue({
      data: stormGlassApiResponseExample
    } as HTTPUtil.Response)

    const stormGlass = new StormGlassHttpClient(mockedRequest)
    const response = await stormGlass.fetchPoints(lat, long)

    // a class StormGlass deve ter um método para normalizar
    // os dados vindos da API.
    expect(response).toEqual(stormGlassApiResponseNormalizedExample)
    expect(response).toBeDefined()
  })

  it('should exclude incomplete data points', async () => {
    const lat = -1.4333344573775566
    const long = -48.48368604061809
    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300
          },
          time: '2020-04-26T00:00:00+00:00'
        }
      ]
    }

    mockedRequest.get.mockResolvedValue({
      data: incompleteResponse
    } as HTTPUtil.Response)

    const stormGlass = new StormGlassHttpClient(mockedRequest)
    const response = await stormGlass.fetchPoints(lat, long)

    expect(response).toEqual([])
  })

  it('should get a generic error from StormGlass class when the request fail before reaching the external service', async () => {
    const lat = -1.4333344573775566
    const long = -48.48368604061809

    mockedRequest.get.mockRejectedValue({ message: 'Network Error' })

    const stormGlass = new StormGlassHttpClient(mockedRequest)

    await expect(stormGlass.fetchPoints(lat, long)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: Network Error'
    )
  })

  it('should get a StormGlassReponse error when StormGlass service responds with an error', async () => {
    const lat = -1.4333344573775566
    const long = -48.48368604061809

    const mockedResponse = {
      response: {
        status: 429,
        data: {
          errors: ['Rate limit reached']
        }
      }
    }

    // 'isRequestError' é um método estático
    // internamente, 'stormGlass' irá chamar o método estático 'isRequestError'
    MockedRequestClass.isRequestError.mockReturnValue(true)
    mockedRequest.get.mockRejectedValue(mockedResponse)

    const stormGlass = new StormGlassHttpClient(mockedRequest)

    await expect(stormGlass.fetchPoints(lat, long)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate limit reached"]} Code: 429'
    )
  })
})

// lat -1.4333344573775566, long -48.48368604061809
