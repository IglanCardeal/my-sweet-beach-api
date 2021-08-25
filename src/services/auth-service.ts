import { compare, hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'

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
    return sign(payload, 'test', { expiresIn: 10000 })
  }
}
