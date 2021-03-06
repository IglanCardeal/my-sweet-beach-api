import './utils/module-alias'

import { Server } from '@overnightjs/core'
import { Application, json } from 'express'
import expressPinoLogger from 'express-pino-logger'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import * as OpenApiValidator from 'express-openapi-validator'
import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types'

import apiSchema from './api-schema.json'

import { ForecastController } from '@src/controllers/forecast-controller'
import { BeachesController } from '@src/controllers/beaches-controller'
import { UsersController } from '@src/controllers/users-controller'

import { Database } from '@src/infra/database'
import { Logger } from '@src/infra/logger'
import { apiErrorValidator } from './middlewares/api-error-validator-middle'

export class SetupServer extends Server {
  private port: number

  constructor (port = 3000) {
    super()
    this.port = port
  }

  public async init (): Promise<void> {
    this.setupExpress()
    await this.apiDocsSetup()
    this.setupControllers()
    await this.setupDatabase()
    this.setupErrorsHandler()
  }

  public start (msg: string): void {
    this.app.listen(this.port, () => {
      Logger.info('[NODE_ENV]: ' + process.env.NODE_ENV)
      Logger.info('[SERVER INFO]: ' + msg)
    })
  }

  public getApp (): Application {
    return this.app
  }

  public async stop (): Promise<void> {
    await Database.disconnect()
  }

  private setupExpress (): void {
    this.app.use(json())
    this.app.use(cors({ origin: '*' }))
    this.app.use(expressPinoLogger({ logger: Logger }))
  }

  private setupControllers (): void {
    const forecastController = new ForecastController()
    const beachesController = new BeachesController()
    const usersController = new UsersController()

    // 'addControllers' da classe pai 'Server'
    this.addControllers([
      forecastController,
      beachesController,
      usersController
    ])
  }

  private async setupDatabase (): Promise<void> {
    try {
      await Database.connect()
    } catch (error) {
      Logger.info(`[DATABASE] Database connection error: ${error}`)
      process.exit(1)
    }
  }

  private async apiDocsSetup (): Promise<void> {
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSchema))
    this.app.use(
      OpenApiValidator.middleware({
        apiSpec: apiSchema as OpenAPIV3.Document,
        validateRequests: true,
        validateResponses: true
      })
    )
  }

  private setupErrorsHandler (): void {
    this.app.use(apiErrorValidator)
  }
}
