import { UserDTO } from "./user-dto"

export interface UserRepo {
  createUser: (userData: UserDTO) => Promise<void>
}

export class CreateUserService {
  constructor(private readonly userRepo?: UserRepo) {}

  public async execute(userData?: UserDTO): Promise<void> {
    (userData)
    return 
  }
}