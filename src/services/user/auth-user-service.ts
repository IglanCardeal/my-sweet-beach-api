import { AuthService } from '../auth/auth-service'
import { UserDTO } from './user-dto'

export interface UserRepo {
  findUserByEmail: (email: string) => Promise<UserDTO | null>
}

interface Response {
  user: UserDTO | null
  passwordComparisonResult: boolean
  token: string
}

export class AuthUserService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly authService = AuthService
  ) {}

  public async execute(email: string, password: string): Promise<Response> {
    const user = await this.userRepo.findUserByEmail(email)
    let token = ''

    if (!user) {
      return { user: null, passwordComparisonResult: false, token }
    }

    const passwordComparisonResult = await this.authService.comparePassword(
      password,
      user.password
    )

    if (passwordComparisonResult) token = AuthService.generateToken(user)

    return { user, passwordComparisonResult, token }
  }
}
