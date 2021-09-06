import { CreateUserService } from '../create-user-service'
import { InMemoryUserRepo, users } from './in-memory-repository'

describe('Create User Service', () => {
  beforeAll(() => {
    users.length = 0
  })

  const userData = {
    id: 'some-id',
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

  it('should create a new user and insert it on users array', async () => {
    const createUserService = new CreateUserService(inUserMemoRepo)
    const result = await createUserService.execute(userData)
    const passwordAreNotEqual = users[0].password !== result.password

    expect(users).toHaveLength(1)
    expect(users[0].email).toBe(result.email)
    expect(passwordAreNotEqual).toBe(true)
  })
})
