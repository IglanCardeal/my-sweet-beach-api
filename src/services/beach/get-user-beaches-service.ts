import { BeachDTO } from './beach-dto'

interface BeachRepo {
  findBeachesByUserId: (userId: string) => Promise<BeachDTO[]>
}

export class GetUserBeachesService {
  constructor (private readonly beachRepo: BeachRepo) {}

  public async execute (userId: string): Promise<BeachDTO[]> {
    const beaches = await this.beachRepo.findBeachesByUserId(userId)

    return beaches
  }
}
