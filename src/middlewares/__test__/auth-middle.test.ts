import { AuthService } from '@src/services/auth-service'
import { authMiddleware } from '../auth-middle'

describe('Auth Middleware', () => {
  it('should verify a JWT token and call then next middleware', () => {
    const jwtToken = AuthService.generateToken({ data: 'fake-data' })
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

  it('should return UNAUTHORIZED if there is a problem on the token verification', () => {
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
})
