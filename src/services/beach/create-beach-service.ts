import { BeachDTO } from './beach-dto'
import { ParamError } from './error'
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

  // mover essas validacoes para objetos de valor2 
  private validate (beach: BeachDTO) {
    this.validatePosition(beach.position)
  }

  private validatePosition (position: string): void {
    const validPositions = ['S', 'E', 'W', 'N']

    if (!validPositions.includes(position)) {
      throw new ParamError(
        `Beach position is not valid. Only 'S', 'E', 'W', 'N' positions are available`
      )
    }
  }
}
