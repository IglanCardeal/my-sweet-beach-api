/* eslint-disable no-unused-vars */
import { AuthService } from '@src/services/auth-service'
import { Schema, Document, model, models } from 'mongoose'

export enum CUSTOM_VALIDATION {
  DUPLICATED = 'DUPLICATED'
}

export interface User {
  _id?: string
  name: string
  email: string
  password: string
}

interface UserDocument extends Omit<User, '_id'>, Document {}

const schema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: [true, 'Email must be unique']
    },
    password: { type: String, required: true }
  },
  {
    toJSON: {
      transform: (_, doc): void => {
        doc.id = doc._id
        delete doc._id
        delete doc.__v
      }
    }
  }
)

schema.path('email').validate(
  async (email: string): Promise<boolean> => {
    const emailExist = await models.User.countDocuments({ email })

    return !emailExist
  },
  'already exist in the database.',
  CUSTOM_VALIDATION.DUPLICATED
)

schema.pre<UserDocument>('save', async function (): Promise<void> {
  if (!this.password || !this.isModified('password')) return

  try {
    const hashedPassword = await AuthService.hashPassword(this.password)

    this.password = hashedPassword
  } catch (error) {
    console.error(`Error hashing the password for the user: ${this.name}`)
  }
})

export const UserModel = model<UserDocument>('User', schema)
