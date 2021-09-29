import config, { IConfig } from 'config'
import mongoose, { Mongoose } from 'mongoose'
import { config as dotenv } from 'dotenv'
import { Logger } from './logger'

dotenv()

const dbConfig: IConfig = config.get('App.database')

const env = dbConfig.util.getEnv('NODE_ENV')
const mongoUrl =
  env === 'production' ? process.env.MONGODB_URL_PROD : dbConfig.get('mongoUrl')
const timeoutInMs = 30_000

export class Database {
  public static async connect (): Promise<Mongoose> {
    try {
      return await mongoose.connect(mongoUrl as string, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: timeoutInMs
      })
    } catch (err) {
      Logger.error(`[DATABASE]: ${err}`)
      throw err
    }
  }

  public static async checkConnectionState (): Promise<void> {
    // 0 = disconnected
    // 1 = connected
    // 2 = connecting
    // 3 = disconnecting
    const state = mongoose.connection.readyState
    if (state === 0 || state === 3) {
      try {
        await Database.connect()
      } catch (error) {
        throw new Error('Database Connection Error')
      }
    }
  }

  public static async disconnect (): Promise<void> {
    await mongoose.connection.close()
  }
}
