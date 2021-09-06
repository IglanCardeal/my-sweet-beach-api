import { UserRepo } from '../auth-user-service'
import { UserDTO } from '../user-dto'

export const users: UserDTO[] = []

export class InMemoryUserRepo implements UserRepo {
  public async findUserByEmail(email: string): Promise<UserDTO> {
    return users.filter((user) => user.email === email)[0]
  }
}
