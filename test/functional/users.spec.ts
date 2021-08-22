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
  })
})
