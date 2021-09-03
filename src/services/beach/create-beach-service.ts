import { BeachDTO } from './beach-dto'
import { BeachRepo } from './ports/beach-repo'

export class CreateBeachService {
  private readonly beachRepo: BeachRepo

  constructor (beachRepo: BeachRepo) {
    this.beachRepo = beachRepo
  }

  public async execute (beach: BeachDTO): Promise<void> {
    this.validate(beach)

    await this.beachRepo.create(beach)
  }

  private validate (beach: BeachDTO) {
    this.validatePosition(beach.position)
  }

  private validatePosition (position: string): void {
    const validPositions = ['S', 'E', 'W', 'N']

    if (!validPositions.includes(position)) {
      throw new Error('')
    }
  }
}
