import { UserModel } from '@src/models/user-model'

describe('Users functional test', () => {
  beforeAll(async () => {
    await UserModel.deleteMany({})
  })

  describe('When creating a new user', () => {
    it('should successfully create a new user', async () => {
      const newUser = {
        name: 'Foo Bar',
        email: 'foo@mail.com',
        password: '123456'
      }

      const response = await global.testRequest.post('/users').send({ newUser })

      expect(response.status).toBe(201)
      expect(response.body).toEqual(expect.objectContaining(newUser))
    })

    it('should return 400 when there is validation error', async () => {
      const newUser = {
        email: 'foo@mail.com',
        password: '123456'
      }

      const response = await global.testRequest.post('/users').send({ newUser })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ 
        code: 400,
        error: 'Users validation failed: name: Path `name` is required.'
      })
    })
  })
})
