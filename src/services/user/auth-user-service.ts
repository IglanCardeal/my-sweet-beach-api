import { UserDTO } from './user-dto'

export interface UserRepo {
  findUserByEmail: (email: string) => Promise<UserDTO>
}

export class AuthUserService {
  constructor(private readonly userRepo: UserRepo) {}

  public async execute(email: string): Promise<UserDTO> {
    const user = await this.userRepo.findUserByEmail(email)

    return user
  }
}
