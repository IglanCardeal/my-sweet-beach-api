// global.testRequest é definido no arquivo jest-setup.ts como
// objeto global de testes
import nock from 'nock'

import { BeachModel, BeachPosition } from '@src/models/beach-model'
import stormGlassApiResponse from '@test/fixtures/stormglass-response.json'

describe('Beach forecast functional test', () => {
  beforeEach(async () => {
    await BeachModel.deleteMany({})
    const defaultBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: BeachPosition.E
    }
    const newBeach = new BeachModel(defaultBeach)

    await newBeach.save()
  })

  it('it should return a forecast with just a few times', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true
      }
    })
      .defaultReplyHeaders({ 'Access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({
        lat: '-33.792726',
        lng: '151.289824',
        params: /(.*)/,
        source: 'noaa'
      })
      .reply(200, stormGlassApiResponse)

    const { body, status } = await global.testRequest.get('/forecast')

    expect(status).toBe(200)
    expect(body).toEqual([
      {
        time: '2020-04-26T00:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 1,
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
            rating: 1,
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
            rating: 1,
            time: '2020-04-26T02:00:00+00:00',
            swellDirection: 182.56,
            swellHeight: 0.28,
            swellPeriod: 3.44,
            waveDirection: 232.86,
            waveHeight: 0.46,
            windDirection: 321.5,
            windSpeed: 100
          }
        ]
      }
    ])
  })
})
