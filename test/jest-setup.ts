import { SetupServer } from '@src/server'
import supertest from 'supertest'

// Este arquivo é responsável por inicializar o servidor para todos os
// testes funcionais.
beforeAll(() => {
  const server = new SetupServer()

  server.init()

  const app = server.getApp()

  // criamos "testRequest" para o objeto
  // global com os métodos do supertest 
  global.testRequest = supertest(app)
})
