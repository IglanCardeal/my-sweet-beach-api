/**
 * Este arquivo é responsável por inicializar o servidor para todos os
 * testes funcionais.
 */

import { SetupServer } from '@src/server'
import supertest from 'supertest'

beforeAll(() => {
  const server = new SetupServer()

  server.init()

  const app = server.getApp()

  global.testRequest = supertest(app)
})
