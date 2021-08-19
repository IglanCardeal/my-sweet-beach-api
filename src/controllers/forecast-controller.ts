import { Controller, Get } from '@overnightjs/core'
import { BeachModel } from '@src/models/beach-model'
import { ForecastService } from '@src/services/forecast-service'
import { Request, Response } from 'express'

// define um base match da rota: /forecast
@Controller('forecast')
export class ForecastController {
  // match em uma rota do tipo: /forecast
  @Get('')
  public async getForecastForLoggedUser (
    _: Request,
    res: Response
  ): Promise<void> {
    const forecast = new ForecastService()
    const beaches = await BeachModel.find({})
    const forecastData = await forecast.processForecastForBeaches(beaches)

    res.status(200).send(forecastData)
  }

  @Get('for') // match em uma rota do tipo: /forecast/for
  public otherRoute (req: Request, res: Response): void {
    // console.log('test')
    res.status(200).json({ msg: 'hello' })
  }
}