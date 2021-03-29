import './utils/module-alias'

import { Server } from '@overnightjs/core'
import { Application, json } from 'express'
import { ForecastController } from './controllers/forecast'

export class SetupServer extends Server {
  private port: number

  constructor(port = 3000) {
    super()
    this.port = port
  }

  public init(): void {
    this.setupExpress()
    this.setupControllers()
  }

  public start(msg: string): void {
    this.app.listen(this.port, () => {
      console.log(msg)
    })
  }

  public getApp(): Application {
    return this.app
  }

  private setupExpress(): void {
    this.app.use(json())
  }

  private setupControllers(): void {
    const forecastController = new ForecastController()

    this.addControllers([forecastController])
  }
}
