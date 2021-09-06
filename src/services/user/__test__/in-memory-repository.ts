import { UserRepo as UserAuthRepo } from '../auth-user-service'
import { UserRepo as UserCreationRepo } from '../create-user-service'
import { UserDTO } from '../user-dto'

export const users: UserDTO[] = []

interface InMemoryRepo extends UserAuthRepo, UserCreationRepo {}

export class InMemoryUserRepo implements InMemoryRepo {
  public async findUserByEmail (email: string): Promise<UserDTO> {
    return users.filter(user => user.email === email)[0]
  }

  public async createUser (userData: UserDTO): Promise<void> {
    users.push(userData)
  }
}
