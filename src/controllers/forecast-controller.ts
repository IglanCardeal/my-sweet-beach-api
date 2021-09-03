import { ClassMiddleware, Controller, Get } from '@overnightjs/core'
import { Request, Response } from 'express'

import { authMiddleware } from '@src/middlewares/auth-middle'
import { BeachModel } from '@src/models/beach-model'
import { ForecastService } from '@src/services/forecast/forecast-service'

// define um base match da rota: /forecast
@Controller('forecast')
@ClassMiddleware(authMiddleware)
export class ForecastController {
  // match em uma rota do tipo: /forecast
  @Get('')
  public async getForecastForLoggedUser (
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.decoded?.id
      const beaches = await BeachModel.find({ user: userId })

      const forecast = new ForecastService()
      const forecastData = await forecast.processForecastForBeaches(beaches)

      res.status(200).send(forecastData)
    } catch (error) {
      console.error(error)

      if (error instanceof Error)
        res.status(500).send({ error: 'Internal Server Error' })
    }
  }
}
