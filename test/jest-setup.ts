import { SetupServer } from '@src/infra/server'
import supertest from 'supertest'

// Este arquivo é responsável por inicializar o servidor para todos os
// testes funcionais.
let server: SetupServer

const startServer = async () => {
  server = new SetupServer()

  await server.init()

  const app = server.getApp()

  // criamos "testRequest" para o objeto
  // global com os métodos do supertest
  global.testRequest = supertest(app)
}

const stopServer = async () => {
  await server.stop()
}

beforeAll(startServer)
afterAll(stopServer)
