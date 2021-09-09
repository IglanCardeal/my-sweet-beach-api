import { UserDTO } from "./user-dto"


export interface UserRepo {
  findUserByEmail: (email: string) => Promise<UserDTO | null>
}

export class FindUserByEmailService {
  constructor(private readonly userRepo: UserRepo) {}

  public async execute(email: string): Promise<UserDTO | null> {
    const user = await this.userRepo.findUserByEmail(email)

    return user
  }
}