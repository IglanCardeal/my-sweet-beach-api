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
    try {
      const forecast = new ForecastService()
      const beaches = await BeachModel.find({})
      const forecastData = await forecast.processForecastForBeaches(beaches)

      res.status(200).send(forecastData)
    } catch (error) {
      console.error(error)
      
      if (error instanceof Error)
        res.status(500).send({ error: 'Internal Server Error' })
    }
  }
}
