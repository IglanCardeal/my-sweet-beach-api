/* eslint-disable no-unused-vars */
import { Schema, Document, model } from 'mongoose'

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N'
}

export interface Beach {
  _id?: string
  lat: number
  lng: number
  name: string
  position: BeachPosition
}

interface BeachDocument extends Omit<Beach, '_id'>, Document {}

const schema = new Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    name: { type: String, required: true },
    position: {
      type: String,
      required: true
    },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
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

export const BeachModel = model<BeachDocument>('Beach', schema)
