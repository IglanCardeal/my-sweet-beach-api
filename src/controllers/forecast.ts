import { Controller, Get } from '@overnightjs/core'
import { Request, Response } from 'express'

// Controller para as rotas de Forecast
@Controller('forecast') // define um base match da rota: /forecast
export class ForecastController {
  @Get('') // match em uma rota do tipo: /forecast
  public getForecastForLoggedUser(_: Request, res: Response): void {
    res.status(200).json([
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
            windDirection: 299.45
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
            windDirection: 310.48
          }
        ]
      }
    ])
  }

  @Get('for') // match em uma rota do tipo: /forecast/for
  public otherRoute(req: Request, res: Response): void {
    // console.log('test')
    res.status(200).json({ msg: 'hello' })
  }
}
