import { BeachModel } from '@src/models/beach-model'
import { BeachDTO, BeachRepo } from '@src/services/beach/create-beach-service'

export class BeachRepository implements BeachRepo {
  async create (data: BeachDTO): Promise<void> {
    const newBeach = new BeachModel(data)

    await newBeach.save()
  }
}
