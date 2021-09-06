import { AuthUserService } from '../auth-user-service'
import { InMemoryUserRepo, users } from './in-memory-repository'

describe('Auth User Service', () => {
  const userData = {
    id: 'some-id',
    name: 'fake name',
    email: 'fake@email.com',
    password: '123'
  }
  const inUserMemoRepo = new InMemoryUserRepo()

  beforeAll(() => {
    users.push(userData)
  })

  describe('Pre Conditions', () => {
    it('should have an "execute" method defined', () => {
      const authUserService = new AuthUserService(inUserMemoRepo)

      expect(authUserService.execute).toBeDefined()
    })

    it('should have at least one user on users array', () => {
      expect(users).toHaveLength(1)
    })
  })

  it('should return user data if the user email exist', async () => {
    const authUserService = new AuthUserService(inUserMemoRepo)
    const result = await authUserService.execute(userData.email) as any

    expect(result).toBeDefined()
    expect(result.name).toBeDefined()
    expect(result.email).toBe(userData.email)
  })

  it('should return undefined if the user email does not exist', async () => {
    const authUserService = new AuthUserService(inUserMemoRepo)
    const result = await authUserService.execute('other@email.com')

    expect(result).toBeUndefined()
  })
})
