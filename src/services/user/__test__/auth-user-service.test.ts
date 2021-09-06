import { AuthUserService } from '../auth-user-service'
import { users } from './in-memory-repository'

describe('Auth User Service', () => {
  const userData = { name: 'fake name', email: 'fake@email.com', password: '123' }

  beforeAll(() => {
    users.push(userData)
  })

  describe('Pre Conditions', () => {
    it('should have an "execute" method defined', () => {
      const authUserService = new AuthUserService()

      expect(authUserService.execute).toBeDefined()
    })

    it('should have at least one user on users array', () => {
      expect(users).toHaveLength(1)
    })
  })

  it('should return user data if the user email exist', async () => {
    const authUserService = new AuthUserService()
    const result = await authUserService.execute(userData)

    expect(result.name).toBeDefined()
  })
})
