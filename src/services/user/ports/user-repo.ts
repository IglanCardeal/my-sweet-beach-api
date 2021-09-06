import { UserDTO } from '../user-dto'

export interface UserRepo {
  findUserByEmail: (email: string) => Promise<UserDTO | null>
  createUser: (userData: UserDTO) => Promise<void>
}