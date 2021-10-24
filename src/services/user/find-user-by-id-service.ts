import { UserDTO } from './user-dto'

export interface UserRepo {
  findUserById: (userId: string) => Promise<UserDTO | null>
}

export class FindUserByIdService {
  constructor(private readonly userRepo: UserRepo) {}

  public async execute(userId: string): Promise<UserDTO | null> {
    return await this.userRepo.findUserById(userId)
  }
}
