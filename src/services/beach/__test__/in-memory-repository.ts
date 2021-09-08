import { BeachDTO } from '../beach-dto'
import { BeachRepository } from '../ports/beach-repo'

export const beaches: BeachDTO[] = []

export class InMemoryRepo implements BeachRepository {
  public async create (data: BeachDTO): Promise<void> {
    beaches.push(data)
  }

  public async findBeachesByUserId (userId: string): Promise<BeachDTO[]> {
    return beaches.filter(beach => beach.user === userId)
  }
}
