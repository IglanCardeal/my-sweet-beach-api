import { AuthService } from '@src/services/auth-service'
import { authMiddleware } from '../auth-middle'

describe('Auth Middleware', () => {
  it('should verify a JWT token and call then next middleware', () => {
    const jwtToken = AuthService.generateToken({ data: 'fake-data' })
    const reqFake = {
      headers: {
        'x-access-token': jwtToken
      }
    }
    const resFake = {}
    const nextFake = jest.fn()

    authMiddleware(reqFake, resFake, nextFake)

    expect(nextFake).toHaveBeenCalled()
  })
})
