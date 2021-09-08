/* eslint-disable no-unused-vars */
import { AuthService } from '@src/services/auth/auth-service'
import { Schema, Document, model, models } from 'mongoose'
import { Logger } from '../logger'

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

schema
  .path('email')
  .validate(
    emailIsAvailable,
    'already exist in the database.',
    CUSTOM_VALIDATION.DUPLICATED
  )

schema.pre<UserDocument>('save', async function (): Promise<void> {
  if (!this.password || !this.isModified('password')) return

  try {
    this.password = await AuthService.hashPassword(this.password)
  } catch (error) {
    Logger.info(`Error hashing the password for the user: ${this.name}`)
    Logger.error(error as any)
  }
})

async function emailIsAvailable (email: string): Promise<boolean> {
  const emailExist = await models.User.countDocuments({ email })

  return !emailExist
}

export const UserModel = model<UserDocument>('User', schema)
