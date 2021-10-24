import { UserModel } from '@src/infra/models/user-model'
import { UserRepository } from '@src/services/user/ports/user-repo'
import { UserDTO } from '@src/services/user/user-dto'

export class UserMongoRepository implements UserRepository {
  public async findUserByEmail(email: string): Promise<UserDTO | null> {
    const user = await UserModel.findOne({ email })

    if (!user) return null

    return { ...user.toJSON(), id: user.id }
  }

  public async createUser(userData: UserDTO): Promise<void> {
    const user = new UserModel(userData)

    await user.save()
  }

  public async findUserById(userId: string): Promise<UserDTO | null> {
    const user = await UserModel.findById(userId)

    if (!user) return null

    return { ...user.toJSON(), id: user.id }
  }
}
