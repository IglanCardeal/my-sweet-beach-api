import { compare, hash } from 'bcrypt'
import { sign, verify } from 'jsonwebtoken'
import config from 'config'

import { User } from '@src/models/user-model'

export interface DecodedUser extends Omit<User, '_id'> {
  id: string
}

/**
 * classe responsável por toda a lógica necessária para autenticação como
 * comparar senhas, gerar hash de senhas e gerar token JWT.
 */
export class AuthService {
  public static async hashPassword (
    password: string,
    salt = 10
  ): Promise<string> {
    return await hash(password, salt)
  }

  public static async comparePassword (
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await compare(password, hashedPassword)
  }

  public static generateToken (payload: { [key: string]: any }): string {
    const key = config.get<string>('App.authentication.key')
    const tokenExpiration = config.get<string>(
      'App.authentication.tokenExpiresIn'
    )

    return sign(payload, key, { expiresIn: tokenExpiration })
  }

  public static decodeToken (token: string): DecodedUser {
    return verify(
      token,
      config.get<string>('App.authentication.key')
    ) as DecodedUser
  }
}