import { Database } from '@src/infra/database'
import { BeachModel } from '@src/infra/models/beach-model'
import { BeachDTO } from '@src/services/beach/beach-dto'
import { BeachRepository } from '@src/services/beach/ports/beach-repo'

export class BeachMongoRepository implements BeachRepository {
  async create (data: BeachDTO): Promise<void> {
    const connectionState = Database.getConnectionState()
    if (connectionState === 'disconnected') {
      try {
        await Database.connect()
      } catch (error) {
        throw new Error('Database Connection Error')
      }
    }
    const newBeach = new BeachModel(data)
    await newBeach.save()
  }

  async findBeachesByUserId (data: string): Promise<BeachDTO[]> {
    const connectionState = Database.getConnectionState()
    if (connectionState === 'disconnected') {
      try {
        await Database.connect()
      } catch (error) {
        throw new Error('Database Connection Error')
      }
    }
    const beaches: BeachDTO[] = await BeachModel.find({ user: data })
    return beaches
  }
}
