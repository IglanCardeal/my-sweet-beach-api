import { AuthService } from '../auth-service'

describe('Authentication Service Class', () => {
  const userPassword = '123456789000'
  let hashedPass: string
  let token: string

  describe('Pre Condition', () => {
    it('should have "hashPassword" "comparePassword" "generateToken" "decodeToken" methods defined', () => {
      expect(AuthService.hashPassword).toBeDefined()
      expect(AuthService.comparePassword).toBeDefined()
      expect(AuthService.generateToken).toBeDefined()
      expect(AuthService.decodeToken).toBeDefined()
    })
  })

  it('should return encrypted password', async () => {
    hashedPass = await AuthService.hashPassword(userPassword)
    const passAreNotEqual = hashedPass !== userPassword
    const passLengthAreNotEqual = hashedPass.length !== userPassword.length

    expect(passAreNotEqual).toBe(true)
    expect(passLengthAreNotEqual).toBe(true)
  })

  it('should return true if the password is correct', async () => {
    await expect(
      AuthService.comparePassword(userPassword, hashedPass)
    ).resolves.toBe(true)
  })

  it('should return false if the password is not correct', async () => {
    await expect(
      AuthService.comparePassword('fake-pass', hashedPass)
    ).resolves.toBe(false)
  })

  it('should generate JWT token with the user data', async () => {
    const userData = {
      id: '1234',
      name: 'fake name',
      email: 'fake@email.com',
      password: hashedPass
    }
    token = AuthService.generateToken(userData)

    expect(token).toBeDefined()
  })

  it('should decode the token with the current user data', () => {
    const resData = AuthService.decodeToken(token)

    expect(resData.id).toBeDefined()
    expect(resData.name).toBeDefined()
    expect(resData.password).toBeUndefined()
    expect(resData.email).toBeUndefined()
  })
})
