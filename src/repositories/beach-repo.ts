import { BeachModel } from '@src/models/beach-model'
import { BeachDTO } from '@src/services/beach/beach-dto'
import { BeachRepo } from '@src/services/beach/ports/beach-repo'

export class MongoBeachRepository implements BeachRepo {
  async create (data: BeachDTO): Promise<void> {
    const newBeach = new BeachModel(data)

    await newBeach.save()
  }
}
