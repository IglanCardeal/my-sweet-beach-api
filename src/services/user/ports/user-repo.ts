import { UserRepo as AuthUserRepo } from '../auth-user-service'
import { UserRepo as CreateUserRepo } from '../create-user-service'

export interface UserRepository extends AuthUserRepo, CreateUserRepo {}
