import { UserModel } from '@src/models/user-model'

describe('Users functional test', () => {
  beforeAll(async () => {
    await UserModel.deleteMany({})
  })

  describe('When creating a new user', () => {
    it('should successfully create a new user with encrypted password', async () => {
      const newUser = {
        name: 'Foo Bar',
        email: 'foo@mail.com',
        password: '123456'
      }

      const response = await global.testRequest.post('/users').send({ newUser })

      expect(response.status).toBe(201)
      expect(response.body).toEqual(expect.objectContaining(newUser))
    })

    it('should return 422 when there is validation error', async () => {
      const newUser = {
        email: 'foo2@mail.com',
        password: '123456'
      }

      const response = await global.testRequest.post('/users').send({ newUser })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        code: 422,
        error: 'User validation failed: name: Path `name` is required.'
      })
    })

    it('should return 409 when the email is already in use', async () => {
      const newUser = {
        name: 'Foo Bar',
        email: 'foo@mail.com',
        password: '123456'
      }

      const response = await global.testRequest.post('/users').send({ newUser })

      expect(response.status).toBe(409)
      expect(response.body).toEqual({
        code: 409,
        error: 'User validation failed: email: already exist in the database.'
      })
    })
  })
})