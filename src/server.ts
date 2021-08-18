import './utils/module-alias'

import { Server } from '@overnightjs/core'
import { Application, json } from 'express'
import { ForecastController } from './controllers/forecast'
import { Database } from './database'

export class SetupServer extends Server {
  private port: number

  constructor (port = 3000) {
    super()
    this.port = port
  }

  public async init (): Promise<void> {
    this.setupExpress()
    this.setupControllers()
    await this.setupDatabase()
  }

  public start (msg: string): void {
    this.app.listen(this.port, () => {
      console.log(msg)
    })
  }

  public getApp (): Application {
    return this.app
  }

  private setupExpress (): void {
    this.app.use(json())
  }

  private setupControllers (): void {
    const forecastController = new ForecastController()

    this.addControllers([forecastController])
  }

  private async setupDatabase (): Promise<void> {
    await Database.connect()
  }

  public async stop (): Promise<void> {
    await Database.disconnect()
  }
}
