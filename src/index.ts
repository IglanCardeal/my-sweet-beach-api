import {SetupServer} from './server'

const PORT = 3000

const server = new SetupServer(PORT)

server.init()

const msg = `
===============================
Server ON 
Listening on port: ${PORT}
===============================
`

server.start(msg)