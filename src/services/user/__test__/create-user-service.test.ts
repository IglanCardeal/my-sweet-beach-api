import { CreateUserService } from '../create-user-service'
import { InMemoryUserRepo, users } from './in-memory-repository'

describe('Create User Service', () => {
  beforeAll(() => {
    users.length = 0
  })

  const userData = {
    name: 'another fake name',
    email: 'fake2@email.com',
    password: '123456'
  }
  const inUserMemoRepo = new InMemoryUserRepo()

  describe('Pre Conditions', () => {
    it('should have an "execute" method', () => {
      const createUserService = new CreateUserService(inUserMemoRepo)

      expect(createUserService.execute).toBeDefined()
    })

    it('should have no users saved', () => {
      expect(users).toHaveLength(0)
    })
  })

  it('should create a new user and insert it on users', async () => {
    const createUserService = new CreateUserService(inUserMemoRepo)

    await expect(createUserService.execute(userData)).resolves.toBeUndefined()
    expect(users).toHaveLength(1)
    expect(users[0].email).toBe(userData.email)
  })
})
