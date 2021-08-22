/* eslint-disable no-unused-vars */
import { Schema, Document, model } from 'mongoose'

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
    email: { type: String, required: true, unique: [true, 'Email must be unique'] },
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

export const UserModel = model<UserDocument>('Users', schema)
