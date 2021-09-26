import { ClassMiddleware, Controller, Get, Middleware } from '@overnightjs/core'
import { Request, Response } from 'express'
import rateLimit from 'express-rate-limit'

import { authMiddleware } from '@src/infra/middlewares/auth-middle'
import { ProcessForecastForBeachesService } from '@src/services/forecast/forecast-service'
import { GetUserBeachesService } from '@src/services/beach/get-user-beaches-service'
import { BeachMongoRepository } from '@src/repositories/beach-repo'
import { BaseController } from './base'
import { Logger } from '@src/infra/logger'
import { ApiError } from '@src/infra/utils/errors/api-error'

const ONE_MINUTE = 1 * 60 * 1_000

const rateLimiter = rateLimit({
  windowMs: ONE_MINUTE,
  max: 10,
  keyGenerator (req: Request) {
    return req.ip
  },
  handler (_, res: Response) {
    return res.status(429).send(
      ApiError.format({
        code: 429,
        message: 'Too many request to the "/forecast" endpoint'
      })
    )
  }
})

@Controller('forecast')
@ClassMiddleware(authMiddleware)
export class ForecastController extends BaseController {
  @Get('')
  @Middleware(rateLimiter)
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
