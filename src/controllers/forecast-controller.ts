import { ClassMiddleware, Controller, Get } from '@overnightjs/core'
import { Request, Response } from 'express'

import { authMiddleware } from '@src/infra/middlewares/auth-middle'
import { ProcessForecastForBeachesService } from '@src/services/forecast/forecast-service'
import { GetUserBeachesService } from '@src/services/beach/get-user-beaches-service'
import { BeachMongoRepository } from '@src/repositories/beach-repo'
import { BaseController } from './base'
import { Logger } from '@src/infra/logger'

// define um base match da rota: /forecast
@Controller('forecast')
@ClassMiddleware(authMiddleware)
export class ForecastController extends BaseController{
  // match em uma rota do tipo: /forecast
  @Get('')
  public async getForecastForLoggedUser (
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.decoded?.id
      const repo = new BeachMongoRepository()
      const getUserBeachesService = new GetUserBeachesService(repo)
      const beaches = await getUserBeachesService.execute(userId as string)

      const processForecast = new ProcessForecastForBeachesService()
      const forecastData = await processForecast.execute(beaches)

      res.status(200).send(forecastData)
    } catch (err) {
      Logger.error(err as any)
      this.sendErrorResponse(res, err as any)
    }
  }
}
