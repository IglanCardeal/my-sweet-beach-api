// global.testRequest é definido no arquivo jest-setup.ts como
// objeto global de testes
import nock from 'nock'

import { BeachModel, BeachPosition } from '@src/models/beach-model'
import { apiForecastResponse } from '@test/fixtures/api-forecast-response'
import { UserModel } from '@src/models/user-model'

import stormGlassApiResponse from '@test/fixtures/stormglass-response.json'

describe('Forecast functional test', () => {
  beforeAll(async () => {
    await BeachModel.deleteMany({})
    await UserModel.deleteMany({})

    const newUser = await new UserModel({
      name: 'Foo',
      email: 'footest@mail.com',
      password: '123456'
    }).save()

    const defaultBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: BeachPosition.E
    }
    const newBeach = new BeachModel({ ...defaultBeach, user: newUser.id })

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
    expect(body).toEqual(apiForecastResponse)
  })

  it('it should return 500 if something goes wrong during the processing', async () => {
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
        lng: '151.289824'
      })
      .replyWithError('something went wrong')

    const { status } = await global.testRequest.get('/forecast')

    expect(status).toBe(500)
  })
})
