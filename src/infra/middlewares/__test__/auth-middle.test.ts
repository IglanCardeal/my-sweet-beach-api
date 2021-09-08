import { AuthService } from '@src/services/auth/auth-service'
import { authMiddleware } from '../auth-middle'

describe('Auth Middleware', () => {
  it('should verify a JWT token and call then next middleware', () => {
    const userData = {
      id: 'some-id',
      name: 'another fake name',
      email: 'fake2@email.com',
      password: '123456'
    }
    const jwtToken = AuthService.generateToken(userData)
    const reqFake = {
      headers: {
        'x-access-token': jwtToken
      },
      decoded: undefined
    }
    const resFake = {}
    const nextFake = jest.fn()

    authMiddleware(reqFake, resFake, nextFake)

    expect(nextFake).toHaveBeenCalled()
    expect(reqFake.decoded).toBeDefined()
  })

  it('should return 401 (UNAUTHORIZED) if there is a problem on the token verification', () => {
    const reqFake = {
      headers: {
        'x-access-token': 'invalid-jwtToken'
      },
      decoded: undefined
    }
    const sendMock = jest.fn()
    const resFake = {
      status: jest.fn(() => ({
        send: sendMock
      }))
    }
    const nextFake = jest.fn()

    authMiddleware(reqFake, resFake as any, nextFake)

    expect(resFake.status).toHaveBeenCalledWith(401)
    expect(sendMock).toHaveBeenCalledWith({ code: 401, error: 'jwt malformed' })
  })

  it('should return 400 (BAD REQUEST) if no token was provided', () => {
    const reqFake = {
      headers: {
        'x-access-token': ''
      },
      decoded: undefined
    }
    const sendMock = jest.fn()
    const resFake = {
      status: jest.fn(() => ({
        send: sendMock
      }))
    }
    const nextFake = jest.fn()

    authMiddleware(reqFake, resFake as any, nextFake)

    expect(resFake.status).toHaveBeenCalledWith(400)
    expect(sendMock).toHaveBeenCalledWith({
      code: 400,
      error: 'Token was not provided'
    })
  })
})
