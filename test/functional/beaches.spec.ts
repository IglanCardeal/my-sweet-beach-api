import { BeachModel } from '@src/models/beach-model'
import { UserModel } from '@src/models/user-model'
import { AuthService } from '@src/services/auth/auth-service'

describe('Beaches functional tests', () => {
  let token: string

  // limpando todos os registros de Beach
  beforeAll(async () => {
    await BeachModel.deleteMany({})
    await UserModel.deleteMany({})

    const newUser = await new UserModel({
      name: 'Foo',
      email: 'footest@mail.com',
      password: '123456'
    }).save()

    token = AuthService.generateToken({ ...newUser.toJSON(), id: newUser.id })
  })

  describe('When creating a beach', () => {
    it('should create a beach with success', async () => {
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E'
      }

      const response = await global.testRequest
        .post('/beaches')
        .set({ 'x-access-token': token })
        .send({ newBeach })

      expect(response.status).toBe(201)
      expect(response.body).toEqual(expect.objectContaining(newBeach))
    })

    it('should return a 422 when there is a validation error', async () => {
      const newBeach = {
        lat: 'invalid string',
        lng: 151.289824,
        name: 'Manly',
        position: 'E'
      }

      const response = await global.testRequest
        .post('/beaches')
        .set({ 'x-access-token': token })
        .send({ newBeach })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        error:
          'Beach validation failed: lat: Cast to Number failed for value "invalid string" (type string) at path "lat"'
      })
    })

    it('should return 500 when there is any error other than validation error', async () => {
      const spy = jest
        .spyOn(BeachModel.prototype, 'save')
        .mockRejectedValue({ error: 'any' })

      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E'
      }

      const response = await global.testRequest
        .post('/beaches')
        .set({ 'x-access-token': token })
        .send({ newBeach })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        error: 'Internal Server Error'
      })

      spy.mockRestore()
    })
  })
})
