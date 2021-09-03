import { BeachDTO } from '../beach-dto'
import { BeachRepo } from '../ports/beach-repo'

const beaches: BeachDTO[] = []

export class InMemoryRepo implements BeachRepo {
  public async create (data: BeachDTO): Promise<void> {
    beaches.push(data)
  }
}
