import config, { IConfig } from 'config'
import mongoose, { Mongoose } from 'mongoose'
import { config as dotenv } from 'dotenv'

dotenv()

const dbConfig: IConfig = config.get('App.database')

const env = dbConfig.util.getEnv('NODE_ENV')
const mongoUrl =
  env === 'production' ? process.env.MONGODB_URL_PROD : dbConfig.get('mongoUrl')

export class Database {
  public static async connect (): Promise<Mongoose> {
    return await mongoose.connect(mongoUrl as string, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }

  public static async disconnect (): Promise<void> {
    await mongoose.connection.close()
  }
}
