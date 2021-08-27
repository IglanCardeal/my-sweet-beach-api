import { UserModel } from '@src/models/user-model'
import { AuthService } from '@src/services/auth-service'

describe('Users functional test', () => {
  describe('When creating a new user', () => {
    beforeAll(async () => {
      await UserModel.deleteMany({})
    })

    it('should successfully create a new user with encrypted password', async () => {
      const newUser = {
        name: 'Foo Bar',
        email: 'foo@mail.com',
        password: '123456'
      }

      const response = await global.testRequest.post('/users').send({ newUser })
      const comparePasswordResult = await AuthService.comparePassword(
        newUser.password,
        response.body.password
      )

      expect(response.status).toBe(201)
      expect(response.body).toEqual(
        expect.objectContaining({
          ...newUser,
          ...{ password: expect.any(String) }
        })
      )
      expect(comparePasswordResult).toBe(true)
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

  describe('When authenticating a user', () => {
    beforeAll(async () => {
      await UserModel.deleteMany({})

      const newUser = {
        name: 'Foo Bar',
        email: 'foo@mail.com',
        password: '123456'
      }
      await new UserModel(newUser).save()
    })

    it('should generate a token for a valid user', async () => {
      const userData = {
        email: 'foo@mail.com',
        password: '123456'
      }

      const response = await global.testRequest
        .post('/users/authenticate')
        .send({ email: userData.email, password: userData.password })

      expect(response.body).toEqual(
        expect.objectContaining({ token: expect.any(String) })
      )
    })

    it('should return UNAUTHORIZED if the user with the given email was not found', async () => {
      const response = await global.testRequest
        .post('/users/authenticate')
        .send({ email: 'fake@mail.com', password: '123456' })

      expect(response.status).toBe(401)
    })

    it('should return UNAUTHORIZED if the user was found but the password does not match', async () => {
      const response = await global.testRequest
        .post('/users/authenticate')
        .send({ email: 'foo@mail.com', password: 'wrong-pass' })

      expect(response.status).toBe(401)
    })
  })
})
