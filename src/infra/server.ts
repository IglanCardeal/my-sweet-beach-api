import config from 'config'
import { config as dotenv } from 'dotenv'

dotenv()

import { SetupServer } from './app'
import { Logger } from './logger'

process.on('unhandledRejection', (reason, promise) => {
  Logger.error(
    `App exiting due unhandled promise: ${promise} with error: ${reason}`
  )

  throw reason
})

process.on('uncaughtException', error => {
  Logger.error(`App exiting due uncaught handled error: ${error}`)

  process.exit(ExitCode.Failure)
})

enum ExitCode {
  Failure = 1,
  Success = 0
}

;(async () => {
  try {
    const PORT =
      (process.env.PORT as string) || (config.get('App.port') as number)
    const msg = `Server ON Listening on port: ${PORT}`
    const server = new SetupServer(+PORT)

    await server.init()
    server.start(msg)

    const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT']

    exitSignals.map(signal => {
      process.on(signal, async () => {
        try {
          await server.stop()

          Logger.info('Server stopped with success')
          process.exit(ExitCode.Success)
        } catch (err) {
          Logger.error(`Server stopper with failure. Error: ${err}`)
          process.exit(ExitCode.Failure)
        }
      })
    })
  } catch (err) {
    Logger.error(`Server exit with error: ${err}`)
    process.exit(ExitCode.Failure)
  }
})()
