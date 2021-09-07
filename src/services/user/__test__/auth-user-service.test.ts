import { AuthService } from '@src/services/auth/auth-service'
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

  beforeAll(async () => {
    const hashedPass = await AuthService.hashPassword(userData.password)
    users.push({ ...userData, password: hashedPass })
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
    const {
      user,
      passwordComparisonResult,
      token
    } = await authUserService.execute(userData.email, userData.password)

    expect(user).toBeDefined()
    expect(passwordComparisonResult).toBe(true)
    expect(token.length).toBeGreaterThan(1)
  })

  it('should return null user if the user email does not exist', async () => {
    const authUserService = new AuthUserService(inUserMemoRepo)
    const { user } = await authUserService.execute('other@email.com', '123456')

    expect(user).toBe(null)
  })

  it('should return false password comparison result if the user pasword is no correct', async () => {
    const authUserService = new AuthUserService(inUserMemoRepo)
    const { passwordComparisonResult } = await authUserService.execute(
      'other@email.com',
      'wrong-pass'
    )

    expect(passwordComparisonResult).toBe(false)
  })
})
