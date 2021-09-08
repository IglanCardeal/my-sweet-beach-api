import pino from 'pino'
import config from 'config'

const logger = pino({
  enabled: config.get<boolean>('App.logger.enabled'),
  level: config.get<string>('App.logger.level')
})

export const Logger = logger
