import { SetupServer } from './server'
import config from 'config'

;(async () => {
  const PORT = config.get('App.port') as number

  const server = new SetupServer(PORT)

  await server.init()

  const msg = `
===============================
Server ON 
Listening on port: ${PORT}
===============================
`

  server.start(msg)
})()
