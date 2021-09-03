import { BeachModel, BeachPosition } from '@src/models/beach-model'

export interface BeachDTO {
  _id?: string
  lat: number
  lng: number
  name: string
  position: BeachPosition
  user: string
}

export class BeachService {
  private readonly beachRepo: unknown

  constructor () {
    this.beachRepo = null
  }

  public async createBeach (beach: BeachDTO): Promise<void> {
    const newBeach = new BeachModel(beach)

    await newBeach.save()
  }
}
