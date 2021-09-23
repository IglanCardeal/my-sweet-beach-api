import { StormGlassHttpClient } from '@src/clients/stormglass-http-client'
import { Beach, GeoPosition } from '@src/infra/models/beach-model'
import { ProcessForecastForBeachesService } from '../forecast-service'

import stormGlassNormalizedResponseFixture from '@test/fixtures/stormglass-response-normalized.json'

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
        position: GeoPosition.E,
        user: 'fake-id'
      }
    ]
    const expectedResponse = [
      {
        time: '2020-04-26T00:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 2,
            swellDirection: 64.26,
            swellHeight: 0.15,
            swellPeriod: 3.89,
            time: '2020-04-26T00:00:00+00:00',
            waveDirection: 231.38,
            waveHeight: 0.47,
            windDirection: 299.45,
            windSpeed: 100
          }
        ]
      },
      {
        time: '2020-04-26T01:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 2,
            swellDirection: 123.41,
            swellHeight: 0.21,
            swellPeriod: 3.67,
            time: '2020-04-26T01:00:00+00:00',
            waveDirection: 232.12,
            waveHeight: 0.46,
            windDirection: 310.48,
            windSpeed: 100
          }
        ]
      },
      {
        time: '2020-04-26T02:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 2,
            swellDirection: 182.56,
            swellHeight: 0.28,
            swellPeriod: 3.44,
            time: '2020-04-26T02:00:00+00:00',
            waveDirection: 232.86,
            waveHeight: 0.46,
            windDirection: 321.5,
            windSpeed: 100
          }
        ]
      }
    ]
    const forecast = new ProcessForecastForBeachesService(
      mockedStormGlassHttpClient
    )
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
        position: GeoPosition.E,
        user: 'some-id'
      }
    ]
    mockedStormGlassHttpClient.fetchPoints.mockRejectedValue(
      'Error fetching data'
    )
    const forecast = new ProcessForecastForBeachesService(
      mockedStormGlassHttpClient
    )
    await expect(forecast.execute(beaches)).rejects.toThrow(Error)
  })

  it('should return the forecast for a list of beaches ordered by rating', async () => {
    // vai ter a pior nota
    mockedStormGlassHttpClient.fetchPoints.mockResolvedValueOnce([
      {
        swellDirection: 123.41,
        swellHeight: 0.21,
        swellPeriod: 3.67,
        time: '2020-04-26T00:00:00+00:00',
        waveDirection: 232.12,
        waveHeight: 0.46,
        windDirection: 310.48,
        windSpeed: 100
      }
    ])
    // vai ter a melhor nota
    mockedStormGlassHttpClient.fetchPoints.mockResolvedValueOnce([
      {
        swellDirection: 64.26,
        swellHeight: 0.15,
        swellPeriod: 13.89,
        time: '2020-04-26T00:00:00+00:00',
        waveDirection: 231.38,
        waveHeight: 2.07,
        windDirection: 299.45,
        windSpeed: 100
      }
    ])
    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: GeoPosition.E,
        user: 'fake-id'
      },
      {
        lat: -33.792726,
        lng: 141.289824,
        name: 'Dee Why',
        position: GeoPosition.S,
        user: 'fake-id'
      }
    ]
    const expectedResponse = [
      {
        time: '2020-04-26T00:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 141.289824,
            name: 'Dee Why',
            position: 'S',
            rating: 3,
            swellDirection: 64.26,
            swellHeight: 0.15,
            swellPeriod: 13.89,
            time: '2020-04-26T00:00:00+00:00',
            waveDirection: 231.38,
            waveHeight: 2.07,
            windDirection: 299.45,
            windSpeed: 100
          },
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 2,
            swellDirection: 123.41,
            swellHeight: 0.21,
            swellPeriod: 3.67,
            time: '2020-04-26T00:00:00+00:00',
            waveDirection: 232.12,
            waveHeight: 0.46,
            windDirection: 310.48,
            windSpeed: 100
          }
        ]
      }
    ]
    const forecast = new ProcessForecastForBeachesService(
      mockedStormGlassHttpClient
    )
    const beachesWithRating = await forecast.execute(beaches)
    expect(beachesWithRating).toEqual(expectedResponse)
  })
})
