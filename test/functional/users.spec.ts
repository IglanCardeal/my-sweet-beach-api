import { UserModel } from '@src/infra/models/user-model'
import { AuthService } from '@src/services/auth/auth-service'
// import { AuthService } from '@src/services/auth/auth-service'

describe('Users functional test', () => {
  describe('When creating a new user', () => {
    beforeAll(async () => {
      await UserModel.deleteMany({})
    })

    it('should successfully create a new user but do not return encrypted password', async () => {
      const newUser = {
        name: 'Foo Bar',
        email: 'foo@mail.com',
        password: '123456'
      }

      const response = await global.testRequest
        .post('/users/create')
        .send({ newUser })

      expect(response.status).toBe(201)
      expect(response.body).toEqual(
        expect.objectContaining({
          ...newUser,
          ...{ password: expect.any(String) }
        })
      )
      expect(response.body.password).toBe('')
    })

    it('should return 400 when there is validation error', async () => {
      const newUser = {
        email: 'foo2@mail.com',
        password: '123456'
      }

      const response = await global.testRequest
        .post('/users/create')
        .send({ newUser })

      expect(response.status).toBe(400)
      expect(response.body).toEqual(
        expect.objectContaining({
          code: 400,
          message: 'User validation failed: name: Path `name` is required.'
        })
      )
    })

    it('should return 400 when the email is already in use', async () => {
      const newUser = {
        name: 'Foo Bar',
        email: 'foo@mail.com',
        password: '123456'
      }

      const response = await global.testRequest
        .post('/users/create')
        .send({ newUser })

      expect(response.status).toBe(400)
      expect(response.body).toEqual(
        expect.objectContaining({
          code: 400,
          message:
            'User validation failed: email: already exist in the database.'
        })
      )
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

  describe('When getting user info', () => {
    beforeAll(async () => {
      await UserModel.deleteMany({})
    })

    it(`should return the token's owner profile information`, async () => {
      const newUser = {
        name: 'Foo Bar',
        email: 'foo22@mail.com',
        password: '123456'
      }
      const user = new UserModel(newUser)
      await user.save()

      const token = AuthService.generateToken({
        ...newUser,
        id: user.toJSON().id
      })
      const { body, status } = await global.testRequest
        .get('/users/me')
        .set({ 'x-access-token': token })

      expect(status).toBe(200)
      expect(body.user).toEqual(
        expect.objectContaining({
          name: 'Foo Bar',
          id: expect.any(String)
        })
      )
    })

    it('shoud return not found when the user was not found', async () => {
      const newUser = {
        name: 'Foo Bar',
        email: 'foo2@mail.com',
        password: '123456'
      }
      const invalidId = '6175a100ac3a0439f33d0d2b'
      const token = AuthService.generateToken({
        ...newUser,
        id: invalidId
      })
      const { body, status } = await global.testRequest
        .get('/users/me')
        .set({ 'x-access-token': token })

      expect(status).toBe(404)
      expect(body.user).toBeUndefined()
    })
  })
})
