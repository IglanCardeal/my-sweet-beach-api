import { ClassMiddleware, Controller, Get } from '@overnightjs/core'
import { Request, Response } from 'express'

import { authMiddleware } from '@src/middlewares/auth-middle'
import { ProcessForecastForBeachesService } from '@src/services/forecast/forecast-service'
import { GetUserBeachesService } from '@src/services/beach/get-user-beaches-service'
import { MongoBeachRepository } from '@src/repositories/beach-repo'

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
      const repo = new MongoBeachRepository()
      const getUserBeachesService = new GetUserBeachesService(repo)
      const beaches = await getUserBeachesService.execute(userId as string)

      const processForecast = new ProcessForecastForBeachesService()
      const forecastData = await processForecast.execute(beaches)

      res.status(200).send(forecastData)
    } catch (error) {
      console.error(error)

      if (error instanceof Error)
        res.status(500).send({ error: 'Internal Server Error' })
    }
  }
}
