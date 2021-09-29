import { Database } from '@src/infra/database'
import { BeachModel } from '@src/infra/models/beach-model'
import { BeachDTO } from '@src/services/beach/beach-dto'
import { BeachRepository } from '@src/services/beach/ports/beach-repo'

export class BeachMongoRepository implements BeachRepository {
  async create (data: BeachDTO): Promise<void> {
    await Database.checkConnectionState()
    const newBeach = new BeachModel(data)
    await newBeach.save()
  }

  async findBeachesByUserId (id: string): Promise<BeachDTO[]> {
    await Database.checkConnectionState()
    const beaches: BeachDTO[] = await BeachModel.find({ user: id })
    return beaches
  }
}
